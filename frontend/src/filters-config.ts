import { identity, uniq } from "lodash";
import { FilterType } from "./types.frontend";

const filtersConfig: FilterType[] = [
  {
    key: "type",
    label: "🏠 Type",
    getValueFromLieu: (lieu) => uniq(lieu.type.map((t) => t.type_destination).filter(identity)),
  },
  {
    key: "prog",
    label: "🏙️ Programme",
    getValueFromLieu: (lieu) => uniq(lieu.type.map((t) => t.destination).filter((t) => t !== "")),
    hide: true,
  },
  {
    key: "moeuvre",
    label: "📐 Maîtres d'œuvre",
    prefixLabel: (plural) => `signé${plural ? "s" : ""}`,
    getValueFromLieu: (lieu) =>
      lieu.maitre_oeuvre ? lieu.maitre_oeuvre.map((m) => m.nom).filter((t) => t !== "") : [],
  },
  {
    key: "mouvrage",
    label: "🔑 Maîtres d'ouvrage",
    prefixLabel: () => "pour",
    getValueFromLieu: (lieu) =>
      lieu.maitre_ouvrage ? lieu.maitre_ouvrage.map((m) => m.nom).filter((t) => t !== "") : [],
  },
  {
    key: "dept",
    label: "📍 Département",
    prefixLabel: () => "en",
    getValueFromLieu: (lieu) => (lieu.département ? [lieu.département] : []),
  },
  {
    key: "date",
    label: "🎉 Date d'inauguration",
    prefixLabel: (plural) => `inauguré${plural ? "s" : ""}`,
    getValueFromLieu: (lieu) => (lieu.périodes ? lieu.périodes.map((p) => p.nom).filter((t) => t !== "") : []),
  },
  {
    key: "dist",
    label: "🥇 Distinction",
    prefixLabel: (plural) => `récompensé${plural ? "s" : ""} par`,
    getValueFromLieu: (lieu) => (lieu.distinctions ? lieu.distinctions.map((d) => d.nom).filter((t) => t !== "") : []),
  },
];

export default filtersConfig;
