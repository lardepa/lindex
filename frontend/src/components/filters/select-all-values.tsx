import { FC } from "react";

import { BsList, BsListCheck } from "react-icons/bs";

import { useQueryParamsState } from "../../hooks/queryParams";
import { FiltersParamType } from "../../types.frontend";
import { every } from "lodash";

export const SelectAllValues: FC<{ options: string[]; filterParams: FiltersParamType }> = ({
  options,
  filterParams,
}) => {
  const [queryParamsState, setQueryParamsState] = useQueryParamsState();

  const currentState = queryParamsState.filtersParams.filter(({ filter }) => filter.key === filterParams.filter.key)[0];
  const selected = currentState && every(options, (v) => currentState.values.includes(v));

  return (
    <button
      className={`btn filter-value ${selected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        if (selected) {
          //DESELECT OPTION

          const newFilters: FiltersParamType[] = [
            //other filters
            ...queryParamsState.filtersParams.filter(({ filter }) => filter.key !== filterParams.filter.key),
            // remove one value to the picker filter
            { ...filterParams, values: (currentState?.values || []).filter((v) => !options.includes(v)) },
          ];
          setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
        } else {
          // SELECT OPTION
          // update filters in URL's search params)
          const newFilters: FiltersParamType[] = [
            //other filters
            ...queryParamsState.filtersParams.filter(({ filter, values }) => filter.key !== filterParams.filter.key),
            // add one value to the picker filter
            { ...filterParams, values: options },
          ];
          setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
        }
      }}
    >
      {selected ? <BsList size="1.5rem" className="icon" /> : <BsListCheck size="1.5rem" className="icon" />} Tout{" "}
      {selected ? "dé" : ""}sélectionner
    </button>
  );
};
