import { ConfigType } from "./types.frontend";

const config: ConfigType = {
  DATA_URL: import.meta.env.VITE_DATA_URL || "",
  RESPONSIVE_BREAKPOINTS: {
    sm: 576,
    md: 768,
  },

  MAP_LAYERS: {
    positron: {
      TILE_CREDITS:
        'Fond de carte par <a target="_blank" href="http://cartodb.com/attributions#basemaps">CartoDB</a>, sous <a target="_blank" href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Données © <a target="_blank" href="http://osm.org/copyright">OpenStreetMap contributors</a> sous ODbL',
      TILE_URL: "https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    },
    "maptiler.pastel": {
      TILE_CREDITS:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      TILE_URL: `https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    },
  },
  MAP_LAYER: import.meta.env.VITE_MAP_LAYER || "positron",
  COLORS: {
    DESTINATIONS: {
      Équipement: "#6F5FF9",
      Logement: "#3EE687",
      "Espace public": "#E6EDED",
    },
  },
};
console.log(config);
export default config;
