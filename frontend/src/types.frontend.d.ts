import { DestinationType } from "./types";

export interface ConfigType {
  DATA_URL: string;
  MAP_KEY: string;
  COLORS: {
    DESTINATIONS: { [Property in DestinationType]: string };
  };
}
