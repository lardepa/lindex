import { FilterType } from "./types.frontend";

const filtersConfig: FilterType[] = [
  {
    key: "use",
    label: "Usage",
    getValueFromLieu: (lieu) => [lieu.type.type_destination],
  },
  {
    key: "date",
    label: "Date d'inauguration",
    prefixLabel: "inaugurés",
    getValueFromLieu: (lieu) => (lieu.périodes ? lieu.périodes.map((p) => p.nom) : []),
  },
];

export default filtersConfig;
