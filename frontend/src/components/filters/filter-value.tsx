import { uniq } from "lodash";
import React from "react";
import { useQueryParamsState } from "../../hooks/queryParams";
import { FiltersParamType } from "../../types.frontend";
import FilterValueIcons from "./filter-value-icons";

const FilterValue: React.FC<{
  filterParams: FiltersParamType;
  value: string;
  selected?: boolean;
}> = ({ filterParams, value }) => {
  const [queryParamsState, setQueryParamsState] = useQueryParamsState();

  const currentState = queryParamsState.filtersParams.filter(({ filter }) => filter.key === filterParams.filter.key)[0];
  const selected = currentState && currentState.values.includes(value);
  return (
    <button
      className={`btn filter-value ${selected ? "selected" : ""}`}
      onClick={() => {
        if (selected) {
          //DESELECT OPTION

          const newFilters: FiltersParamType[] = [
            //other filters
            ...queryParamsState.filtersParams.filter(({ filter }) => filter.key !== filterParams.filter.key),
            // remove one value to the picker filter
            { ...filterParams, values: (currentState?.values || []).filter((v) => v !== value) },
          ];
          setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
        } else {
          // SELECT OPTION
          // update filters in URL's search params)
          const newFilters: FiltersParamType[] = [
            //other filters
            ...queryParamsState.filtersParams.filter(({ filter, values }) => filter.key !== filterParams.filter.key),
            // add one value to the picker filter
            { ...filterParams, values: uniq([...(currentState?.values || []), value]) },
          ];
          setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
        }
      }}
    >
      {filterParams.filter.getTypeFromValue && (
        <FilterValueIcons filterKey={filterParams.filter.key} value={filterParams.filter.getTypeFromValue(value)} />
      )}
      {filterParams.filter.getLabelFromValue ? filterParams.filter.getLabelFromValue(value) : value}
    </button>
  );
};

export default FilterValue;
