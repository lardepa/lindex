import { AirtableBase } from "airtable/lib/airtable_base";
import fs from "fs";
import Airtable from "airtable";
import { keys, values } from "lodash";
import https from "https";
import { Media } from "./types";

// load .env variables into process.env
require("dotenv").config();

const dumpObjects = (
  base: AirtableBase,
  table: string,
  lastImportDate?: string | null
) => {
  return new Promise((resolve, reject) => {
    // retrieve new objects from airtable and save them on disk as a map by id
    const selectOptions: any = {};
    if (lastImportDate) {
      selectOptions.filterByFormula = `IS_AFTER(LAST_MODIFIED_TIME(),"${lastImportDate}")`;
    }
    const data: { [key: string]: any } = {};
    const page = 1;
    base(table)
      .select(selectOptions)
      .eachPage(
        (records, fetchNextPage) => {
          console.log(`${table}: fetched ${records.length} from page ${page}`);
          records.forEach((record) => {
            // copy data in memory
            data[record.id] = { id: record.id, ...record.fields };
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(`${table}: done`);
          resolve(data);
        }
      );
  });
};

const importAllTables = async (incremental?: boolean) => {
  //TODO: incremantal is deprecated cause there iw no easy way to get deleted items
  incremental = false;
  const base = Airtable.base(process.env.AIRTABLE_BASE);
  // get last import date
  let lastImportDate: string | null = null;
  if (incremental && fs.existsSync(".last_import_date"))
    lastImportDate = fs.readFileSync(".last_import_date").toString();

  try {
    const dataset = {};
    for (let table of ["lieux", "professionnels", "périodes", "média"]) {
      const incomingData: { [key: string]: any } = await dumpObjects(
        base,
        table,
        lastImportDate
      );
      if (keys(incomingData).length > 0) {
        let newData = incomingData;
        if (incremental) {
          // update existingData
          const existingData = fs.existsSync(`data/${table}.json`)
            ? JSON.parse(fs.readFileSync(`data/${table}.json`).toString())
            : {};
          // TODO: find a way to get deleted items
          newData = { ...existingData, ...incomingData };
        }
        dataset[table] = newData;
        // storing on disk
        fs.writeFileSync(
          `data/${table}.json`,
          JSON.stringify(newData, null, 2)
        );
        console.log(`data/${table}.json updated`);
      }
    }
    // write import date into disk
    fs.writeFileSync(`.last_import_date`, new Date().toISOString());
    return dataset;
  } catch (error) {
    console.error(error);
  }
};

const downloadFile = (url: string, filenameWithoutExtension: string) => {
  https.get(url, (res) => {
    // Image will be stored at this path
    const ext = res.headers["content-type"].split("/").slice(-1);
    const fileStream = fs.createWriteStream(
      `${filenameWithoutExtension}.${ext}`
    );
    res.pipe(fileStream);
    fileStream.on("finish", () => {
      fileStream.close();
      console.log(`Download ${url} completed`);
    });
  });
};

importAllTables().then(async (dataset) => {
  // download media
  const fichierIds = new Set<string>();
  values(dataset["média"]).forEach((media: Media) => {
    if (media.fichiers && media.fichiers.length > 0) {
      media.fichiers.forEach((fichier) => {
        fichierIds.add(fichier.id);
        const dirname = `attachments/${fichier.id}/`;
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname);
          downloadFile(fichier.url, `${dirname}/full`);
          if (fichier.thumbnails && fichier.thumbnails.small)
            downloadFile(fichier.thumbnails.small.url, `${dirname}/small`);
          if (fichier.thumbnails && fichier.thumbnails.large)
            downloadFile(fichier.thumbnails.large.url, `${dirname}/large`);
        }
      });
    }
  });
  // remove deprecated attachments
  fs.readdirSync("attachments", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !fichierIds.has(dirent.name))
    .forEach((dirent) => {
      fs.rmSync(`attachments\${dirent.name}`, { recursive: true, force: true });
    });
  // todo: hydrate lieux's foreign keys
});
