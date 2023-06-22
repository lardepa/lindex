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
    key: "programme",
    label: "Programmes",
    pictoURL: typologie,
    getValueFromLieu: (lieu) => uniq(lieu.type.map((t) => t.destination).filter(identity)),
    //  uniq(lieu.type.map((t) => [t.destination, t.type_destination].join("|")).filter(identity)),
    // getLabelFromValue: (value) => value.split("|")[0],
    // getTypeFromValue: (value) => value.split("|")[1],
  },
  {
    key: "moeuvre",
    label: "Maîtres d'œuvre",
    pictoURL: maitre_oeuvre,
    prefixLabel: (plural) => `signé${plural ? "s" : ""}`,
    getValueFromLieu: (lieu) =>
      lieu.maitre_oeuvre ? lieu.maitre_oeuvre.map((m) => m.nom).filter((t) => t !== "") : [],
  },
  {
    key: "mouvrage",
    label: "Maîtres d'ouvrage",
    pictoURL: maitre_ouvrage,
    prefixLabel: () => "pour",
    getValueFromLieu: (lieu) =>
      lieu.maitre_ouvrage ? lieu.maitre_ouvrage.map((m) => m.nom).filter((t) => t !== "") : [],
  },
  {
    key: "dept",
    label: "Départements",
    pictoURL: departement,
    prefixLabel: () => "en",
    getValueFromLieu: (lieu) => (lieu.département ? [lieu.département] : []),
  },
  {
    key: "date",
    label: "Dates d'inauguration",
    pictoURL: inauguration,
    prefixLabel: (plural) => `inauguré${plural ? "s" : ""}`,
    getValueFromLieu: (lieu) => (lieu.périodes ? lieu.périodes.map((p) => p.nom).filter((t) => t !== "") : []),
  },
  {
    key: "dist",
    label: "Distinctions",
    pictoURL: distinction,
    prefixLabel: (plural) => `récompensé${plural ? "s" : ""} par`,
    getValueFromLieu: (lieu) => (lieu.distinctions ? lieu.distinctions.map((d) => d.nom).filter((t) => t !== "") : []),
    selectAll: true,
  },
  {
    key: "sel",
    label: "Sélections des invités",
    pictoURL: selection,
    prefixLabel: (plural) => `sélectionné${plural ? "s" : ""} par`,
    getValueFromLieu: (lieu) => (lieu.sélections ? lieu.sélections.map((s) => s.invité).filter((t) => t !== "") : []),
    selectAll: true,
  },
  {
    key: "parc",
    label: "Parcours",
    pictoURL: parcours,
    prefixLabel: (plural) => `${plural ? "font" : "fait"} partie de`,
    getValueFromLieu: (lieu) => (lieu.parcours ? lieu.parcours.map((p) => p.nom).filter((t) => t !== "") : []),
    selectAll: true,
  },
];

export default filtersConfig;
