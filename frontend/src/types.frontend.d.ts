import { DestinationType, LieuType } from "./types";

export interface ConfigType {
  DATA_URL: string;
  RESPONSIVE_BREAKPOINTS: {
    sm: number;
    md: number;
  };
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
  pictoURL: string; // the icon URL
  getValueFromLieu: (lieu: LieuType) => string[]; // used to index filter values
  getLabelFromValue?: (value: string) => string;
  getTypeFromValue?: (value: string) => string;
  prefixLabel?: (plural: boolean) => string; //used to render the current filter state phrase
  hide?: boolean;
  selectAll?: boolean;
}

export interface FiltersParamType {
  filter: FilterType;
  values: string[];
}

export interface QueryParamsState {
  filtersParams: FiltersParamType[];
  isPreview: boolean;
  selection?: string;
  parcours?: string;
}
export interface StatiPageContent {
  modelName: "a_propos" | "glossaire";
  title: string;
}
