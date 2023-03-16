import { identity, uniq } from "lodash";
import { FilterType } from "./types.frontend";
import typologie from "./components/filters/pictos/typologie.png";
import maitre_oeuvre from "./components/filters/pictos/MaitreOeuvre.png";
import maitre_ouvrage from "./components/filters/pictos/MaitreOuvrage.png";
import departement from "./components/filters/pictos/Dep.png";
import inauguration from "./components/filters/pictos/inauguration.png";
import distinction from "./components/filters/pictos/Distinction.png";
import selection from "./components/filters/pictos/selection.png";
import parcours from "./components/filters/pictos/parcours.png";

const filtersConfig: FilterType[] = [
  {
    key: "type",
    label: "Typologie",
    pictoURL: typologie,
    getValueFromLieu: (lieu) => uniq(lieu.type.map((t) => t.type_destination).filter(identity)),
  },
  {
    key: "moeuvre",
    label: "Maître d'œuvre",
    pictoURL: maitre_oeuvre,
    prefixLabel: (plural) => `signé${plural ? "s" : ""}`,
    getValueFromLieu: (lieu) =>
      lieu.maitre_oeuvre ? lieu.maitre_oeuvre.map((m) => m.nom).filter((t) => t !== "") : [],
  },
  {
    key: "mouvrage",
    label: "Maître d'ouvrage",
    pictoURL: maitre_ouvrage,
    prefixLabel: () => "pour",
    getValueFromLieu: (lieu) =>
      lieu.maitre_ouvrage ? lieu.maitre_ouvrage.map((m) => m.nom).filter((t) => t !== "") : [],
  },
  {
    key: "dept",
    label: "Département",
    pictoURL: departement,
    prefixLabel: () => "en",
    getValueFromLieu: (lieu) => (lieu.département ? [lieu.département] : []),
  },
  {
    key: "date",
    label: "Date d'inauguration",
    pictoURL: inauguration,
    prefixLabel: (plural) => `inauguré${plural ? "s" : ""}`,
    getValueFromLieu: (lieu) => (lieu.périodes ? lieu.périodes.map((p) => p.nom).filter((t) => t !== "") : []),
  },
  {
    key: "dist",
    label: "Distinction",
    pictoURL: distinction,
    prefixLabel: (plural) => `récompensé${plural ? "s" : ""} par`,
    getValueFromLieu: (lieu) => (lieu.distinctions ? lieu.distinctions.map((d) => d.nom).filter((t) => t !== "") : []),
  },
  {
    key: "sel",
    label: "Sélection",
    pictoURL: selection,
    prefixLabel: (plural) => `sélectionné${plural ? "s" : ""} par`,
    getValueFromLieu: (lieu) => (lieu.sélections ? lieu.sélections.map((s) => s.invité).filter((t) => t !== "") : []),
  },
  {
    key: "parc",
    label: "Parcours",
    pictoURL: parcours,
    prefixLabel: (plural) => `${plural ? "font" : "fait"} partie de`,
    getValueFromLieu: (lieu) => (lieu.parcours ? lieu.parcours.map((p) => p.nom).filter((t) => t !== "") : []),
  },
];

export default filtersConfig;
