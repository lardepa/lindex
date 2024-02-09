import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import fs from "fs";
import https from "https";
import {
  flatten,
  keyBy,
  keys,
  mapValues,
  replace,
  reverse,
  sortBy,
  values,
} from "lodash";
import {
  ContenuType,
  Dataset,
  LieuAirTable,
  LieuType,
  MediaType,
  NewsType,
  ParcoursAirtable,
  ParcoursType,
  SelectionAirtable,
  SelectionType,
} from "./types";
import { taskInSeries } from "./utils";

// load .env variables into process.env
require("dotenv").config();

const sanitizeAirTableMarkdown = (markdown: string): string => {
  let sanitized = markdown;
  // trailing whitespace in bold outside markers "**something **" => "**something** "
  sanitized = replace(
    sanitized,
    /\*\*([ \s]*)([^*]*[^ \s])([ \s]*)\*\*/g,
    "$1**$2**$3"
  );

  return sanitized;
};

const geolocalisationRgexp = new RegExp(/-?\d+(\.\d+)?,-?\d+(\.\d+)?/);

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
const saveModelOnDisk = (
  modelName: string,
  data: Array<LieuType | ParcoursType | SelectionType>
): void => {
  // write public objects
  fs.writeFileSync(
    `${process.env.DATA_PATH}/data/${modelName}.json`,
    JSON.stringify(
      data.filter((o) => o.status === "Publié"),
      null,
      2
    )
  );
  // write all including preview objects
  fs.writeFileSync(
    `${process.env.DATA_PATH}/data/${modelName}_preview.json`,
    JSON.stringify(data, null, 2)
  );

  // write individual object json
  if (!fs.existsSync(`${process.env.DATA_PATH}/data/${modelName}`))
    fs.mkdirSync(`${process.env.DATA_PATH}/data/${modelName}/`);
  data.forEach((o) => {
    fs.writeFileSync(
      `${process.env.DATA_PATH}/data/${modelName}/${o.id}.json`,
      JSON.stringify(o, null, 2)
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
    const dataset: Dataset = {};
    for (let table of [
      "lieux",
      "professionnels",
      "périodes",
      "médias",
      "types_lieu",
      "sélections",
      "distinctions",
      "parcours",
      "contenus",
      "glossaire",
    ]) {
      const incomingData: { [key: string]: any } = await dumpObjects(
        base,
        table,
        lastImportDate
      );
      if (keys(incomingData).length > 0) {
        let newData = incomingData;
        // correcting thumbnails generation issue in airtable
        if (table === "médias") {
          newData = mapValues(newData, (media: MediaType) => {
            if (media.fichiers)
              return {
                ...media,
                fichiers: media.fichiers.map((fichier) => {
                  if (
                    fichier.thumbnails &&
                    fichier.thumbnails.full &&
                    fichier.thumbnails.full.width === 3000 &&
                    fichier.thumbnails.full.height === 3000
                  )
                    return {
                      ...fichier,
                      thumbnails: {
                        ...fichier.thumbnails,
                        full: {
                          width: fichier.width,
                          height: fichier.height,
                          url: fichier.url,
                        },
                      },
                    };
                  else return fichier;
                }),
              };
            return media;
          });
        }
        if (incremental) {
          // update existingData
          const existingData = fs.existsSync(
            `${process.env.DATA_PATH}/data/${table}_airtable.json`
          )
            ? JSON.parse(
                fs
                  .readFileSync(
                    `${process.env.DATA_PATH}/data/${table}_airtable.json`
                  )
                  .toString()
              )
            : {};
          // TODO: find a way to get deleted items
          newData = { ...existingData, ...incomingData };
        }

        dataset[table] = newData;

        // storing on disk
        fs.writeFileSync(
          `${process.env.DATA_PATH}/data/${table}_airtable.json`,
          JSON.stringify(newData, null, 2)
        );
        console.log(`data/${table}.json updated`);
      }
    }
    // write import date into disk
    fs.writeFileSync(
      `${process.env.DATA_PATH}/.last_import_date`,
      new Date().toISOString()
    );
    return dataset;
  } catch (error) {
    console.error(error);
  }
};

const downloadFile = async (url: string, filepath: string) => {
  const promise = new Promise<void>((resolve) => {
    https.get(url, (res) => {
      // Image will be stored at this path
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        console.log(`Download ${url} -> ${filepath} completed`);
        resolve();
      });
    });
  });
  return promise;
};

importAllTables().then(async (dataset) => {
  // download media
  const fichierIds = new Set<string>();
  const attachmentDir = `${process.env.DATA_PATH}/data/attachments`;
  if (!fs.existsSync(attachmentDir)) {
    fs.mkdirSync(attachmentDir);
  }
  await taskInSeries(
    values(dataset.médias).map((media: MediaType) => async () => {
      if (media.fichiers && media.fichiers.length > 0) {
        await Promise.all(
          media.fichiers.map(async (fichier) => {
            fichierIds.add(fichier.id);
            const ext = fichier.type.split("/").slice(-1);
            const dirname = `${attachmentDir}/${fichier.id}`;
            if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);

            if (!fs.existsSync(`${dirname}/full.${ext}`))
              await downloadFile(fichier.url, `${dirname}/full.${ext}`);
            if (
              fichier.thumbnails &&
              fichier.thumbnails.small &&
              !fs.existsSync(`${dirname}/small.${ext}`)
            )
              await downloadFile(
                fichier.thumbnails.small.url,
                `${dirname}/small.${ext}`
              );
            if (
              fichier.thumbnails &&
              fichier.thumbnails.large &&
              !fs.existsSync(`${dirname}/large.${ext}`)
            )
              await downloadFile(
                fichier.thumbnails.large.url,
                `${dirname}/large.${ext}`
              );
          })
        );
      }
    })
  );
  // remove deprecated attachments
  fs.readdirSync(`${process.env.DATA_PATH}/data/attachments`, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory() && !fichierIds.has(dirent.name))
    .forEach((dirent) => {
      console.log(`removing attachment ${dirent.name}`);
      fs.rmSync(`${process.env.DATA_PATH}/data/attachments/${dirent.name}`, {
        recursive: true,
        force: true,
      });
    });
  // hydrate lieux's foreign keys
  const lieux: { [key: string]: LieuType } = mapValues(
    dataset.lieux,
    (lieuAirtable: LieuAirTable): LieuType => {
      // replacing ids by foreign objects
      const lieu: LieuType = {
        ...lieuAirtable,
        présentation: sanitizeAirTableMarkdown(lieuAirtable["présentation"]),
        maitre_oeuvre:
          lieuAirtable["maitre_oeuvre"] &&
          flatten([lieuAirtable["maitre_oeuvre"]]).map(
            (p) => dataset.professionnels[p]
          ),
        maitre_ouvrage:
          lieuAirtable["maitre_ouvrage"] &&
          flatten([lieuAirtable["maitre_ouvrage"]]).map(
            (p) => dataset.professionnels[p]
          ),
        périodes:
          lieuAirtable.périodes &&
          lieuAirtable.périodes.map((p) => dataset.périodes[p]),
        geolocalisation: geolocalisationRgexp.test(lieuAirtable.geolocalisation)
          ? lieuAirtable.geolocalisation.split(",").map((l) => parseFloat(l))
          : null,
        médias:
          lieuAirtable["médias"] &&
          lieuAirtable["médias"].map((m) => dataset.médias[m] as MediaType),
        cover_media:
          lieuAirtable["cover_media"] &&
          dataset.médias[lieuAirtable["cover_media"]],
        type: flatten([lieuAirtable["type"] || []]).map(
          (t) => dataset.types_lieu[t]
        ),
        distinctions:
          lieuAirtable.distinctions &&
          lieuAirtable.distinctions.map((d) => dataset.distinctions[d]),
        sélections:
          lieuAirtable.sélections &&
          lieuAirtable.sélections.map((s) => dataset.sélections[s]),
        parcours:
          lieuAirtable.parcours &&
          lieuAirtable.parcours.map((p) => dataset.parcours[p]),
      };
      return lieu;
    }
  );
  saveModelOnDisk("lieux", values(lieux));
  // hydrate parcours
  const parcours: any = mapValues(
    dataset.parcours,
    (parcoursAirtable: ParcoursAirtable): ParcoursType => {
      // replacing ids by foreign objects
      const p: ParcoursType = {
        ...parcoursAirtable,
        édito: sanitizeAirTableMarkdown(parcoursAirtable.édito),
        date: parcoursAirtable.date || new Date(),
        lieux: (parcoursAirtable["lieux"] || []).map((l) => lieux[l]),
        médias:
          parcoursAirtable["médias"] &&
          parcoursAirtable["médias"].map((m) => dataset.médias[m] as MediaType),
        cover_media:
          parcoursAirtable["cover_media"] &&
          dataset.médias[parcoursAirtable["cover_media"]],
      };
      return p;
    }
  );
  saveModelOnDisk("parcours", values(parcours));
  // hydrate sélections
  const selections = mapValues(
    dataset.sélections,
    (selectionAirtable: SelectionAirtable): SelectionType => {
      // replacing ids by foreign objects
      const s: SelectionType = {
        ...selectionAirtable,
        édito: sanitizeAirTableMarkdown(selectionAirtable.édito),
        introduction: sanitizeAirTableMarkdown(selectionAirtable.introduction),
        date: selectionAirtable.date || new Date(),
        lieux: (selectionAirtable.lieux || []).map((l) => lieux[l]),
        portrait:
          selectionAirtable.portrait &&
          dataset.médias[selectionAirtable.portrait],
      };
      return s;
    }
  );
  saveModelOnDisk(
    "selections",
    reverse(sortBy(values(selections), (s) => s.date))
  );
  // en une objects
  const dateFormater = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const news: NewsType[] = sortBy(
    [
      ...(values(lieux)
        .filter((l) => l["en une"])
        .map((l) => ({
          id: l.id,
          type: "lieux",
          status: l.status,
          cover_media: l.cover_media,
          title: l.nom,
          subtitle: l.maitre_oeuvre.map((m) => m.nom).join(", "),
          lastModification: l["dernière modification"],
        })) as NewsType[]),
      ...(values(selections)
        .filter((s) => s["en une"])
        .map((s: SelectionType) => ({
          id: s.id,
          type: "selections",
          status: s.status,
          cover_media: s.portrait,
          title: s.invité,
          subtitle: s["sous-titre"],
          lastModification: s["dernière modification"],
        })) as NewsType[]),
      ...(values(parcours)
        .filter((l) => l["en une"])
        .map((p: ParcoursType) => ({
          id: p.id,
          type: "parcours",
          status: p.status,
          cover_media: p.cover_media,
          title: p.nom,
          subtitle: p["sous-titre"],
          lastModification: p["dernière modification"],
        })) as NewsType[]),
    ],
    (o) => o.lastModification
  );
  fs.writeFileSync(
    `${process.env.DATA_PATH}/data/news_preview.json`,
    JSON.stringify(news, null, 2)
  );
  fs.writeFileSync(
    `${process.env.DATA_PATH}/data/news.json`,
    JSON.stringify(
      news.filter((n) => n.status === "Publié"),
      null,
      2
    )
  );
  console.log(`data/news.json updated`);
  fs.writeFileSync(
    `${process.env.DATA_PATH}/data/a_propos.json`,
    JSON.stringify(
      sortBy(
        values(dataset["contenus"])
          .filter((n: ContenuType) => n.page === "à propos")
          .map((c) => ({
            ...c,
            chapeau: sanitizeAirTableMarkdown(c.chapeau),
            contenu: sanitizeAirTableMarkdown(c.contenu),
            médias:
              c.médias && c.médias.map((m) => dataset.médias[m] as MediaType),
          })),
        (c) => c.ordre
      ),
      null,
      2
    )
  );
  fs.writeFileSync(
    `${process.env.DATA_PATH}/data/glossaire.json`,
    JSON.stringify(
      sortBy(
        values(dataset["contenus"])
          .filter((n: ContenuType) => n.page === "glossaire")
          .map((c) => ({
            ...c,
            chapeau: sanitizeAirTableMarkdown(c.chapeau),
            contenu: sanitizeAirTableMarkdown(c.contenu),
            definitions: dataset[c.section.toLowerCase()]
              ? sortBy(values(dataset[c.section.toLowerCase()]), (d) => d.nom)
              : undefined,
            médias:
              c.médias && c.médias.map((m) => dataset.médias[m] as MediaType),
          })),
        (c) => c.ordre
      ),
      null,
      2
    )
  );

  fs.writeFileSync(
    `${process.env.DATA_PATH}/data/types_lieu.json`,
    JSON.stringify(
      keyBy(dataset.types_lieu, (tp) => tp.destination),
      null,
      2
    )
  );
});
