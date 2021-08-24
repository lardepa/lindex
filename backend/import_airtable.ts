const { AirtableBase } = require("airtable/lib/airtable_base");
import fs from "fs";
import Airtable from "airtable";

// load .env variables into process.env
require("dotenv").config();

const dumpObjects = (
  base: any,
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
            data[record.id] = { ...record.fields };
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

const importAllTables = async () => {
  const base = Airtable.base(process.env.AIRTABLE_BASE);
  // get last import date
  let lastImportDate: string | null = null;
  if (fs.existsSync(".last_import_date"))
    lastImportDate = fs.readFileSync(".last_import_date").toString();

  try {
    for (let table of ["lieux", "professionnels", "périodes", "média"]) {
      const data: { [key: string]: any } = await dumpObjects(
        base,
        table,
        lastImportDate
      );
      // update existingData

      const existingData = fs.existsSync(`data/${table}.json`)
        ? JSON.parse(fs.readFileSync(`data/${table}.json`).toString())
        : {};
      const newData = { ...existingData, ...data };
      // storing on disk
      fs.writeFileSync(`data/${table}.json`, JSON.stringify(newData, null, 2));
    }
    // write import date into disk
    fs.writeFileSync(`.last_import_date`, new Date().toISOString());
  } catch (error) {
    console.error(error);
  }
};

importAllTables();
