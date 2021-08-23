const { AirtableBase } = require("airtable/lib/airtable_base");
const fs = require("fs");
const Airtable = require("airtable");

const dumpObjects = (
  base: any,
  table: string,
  lastImportDate?: string | null
) => {
  // retrieve new objects from airtable and save them on disk as a map by id
  const selectOptions: any = {
    maxRecords: 10,
  };
  if (lastImportDate) {
    selectOptions.filterByFormula = `IS_AFTER(LAST_MODIFIED_TIME(), DATETIME_PARSE(${lastImportDate}, 'YYYY-MM-DD HH:mm'))`;
  }
  const data: { [key: string]: any } = {};
  base(table)
    .select(selectOptions)
    .eachPage(
      (records, fetchNextPage) => {
        records.forEach((record) => {
          // copy data in memory
          data[record.id] = { ...record.fields };
        });
        console.log("end page");
        fetchNextPage();
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("done");
        // storing on disk
        fs.writeFileSync(`data/${table}.json`, JSON.stringify(data, null, 2));
        return data;
      }
    );
};

const base = Airtable.base("appVjnrpPJkvEZkDg");

for (let table of ["lieux", "professionnels", "périodes", "média"]) {
  dumpObjects(base, table);
}
