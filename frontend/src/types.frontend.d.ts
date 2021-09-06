import { DestinationType } from "./types";

export interface ConfigType {
  DATA_URL: string;
  COLORS: {
    DESTINATIONS: { [Property in DestinationType]: string };
  };
  MAP_LAYER: string;
  MAP_LAYERS: {
    [style: string]: {
      TILE_CREDITS: string;
      TILE_URL: string;
    };
  };
}
