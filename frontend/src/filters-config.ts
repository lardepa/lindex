import { uniq } from "lodash";
import { FilterType } from "./types.frontend";

const filtersConfig: FilterType[] = [
  {
    key: "type",
    label: "🏠 Typologies",
    getValueFromLieu: (lieu) => uniq(lieu.type.map((t) => t.type_destination)),
  },
  {
    key: "moeuvre",
    label: "📐 Maîtres d'œuvre",
    prefixLabel: "signés",
    getValueFromLieu: (lieu) => (lieu.maitre_oeuvre ? lieu.maitre_oeuvre.map((m) => m.nom) : []),
  },
  {
    key: "mouvrage",
    label: "🔑 Maîtres d'ouvrage",
    prefixLabel: "pour",
    getValueFromLieu: (lieu) => (lieu.maitre_ouvrage ? lieu.maitre_ouvrage.map((m) => m.nom) : []),
  },
  {
    key: "dept",
    label: "📍 Département",
    prefixLabel: "en",
    getValueFromLieu: (lieu) => (lieu.département ? [lieu.département] : []),
  },
  {
    key: "date",
    label: "🎉 Date d'inauguration",
    prefixLabel: "inaugurés",
    getValueFromLieu: (lieu) => (lieu.périodes ? lieu.périodes.map((p) => p.nom) : []),
  },
  {
    key: "dist",
    label: "🥇 Distinction",
    prefixLabel: "récompensé par",
    getValueFromLieu: (lieu) => (lieu.distinctions ? lieu.distinctions.map((d) => d.nom) : []),
  },
];

export default filtersConfig;
