import { DestinationType, LieuType } from "./types";

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

export interface FilterType {
  key: string; // used in URL to store state
  label: string; // used in UI for filter menu
  getValueFromLieu: (lieu: LieuType) => string[]; // used to index filter values
  prefixLabel?: string; //used to render the current filter state phrase
}

export interface FiltersParamType {
  filter: FilterType;
  values: string[];
}

export interface QueryParamsState {
  filtersParams: FiltersParamType[];
  isPreview: boolean;
}
