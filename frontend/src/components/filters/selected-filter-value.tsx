import React from "react";
import { FiltersParamType } from "../../types.frontend";
import FilterValue from "./filter-value";

const SelectedFilterValues: React.FC<{ filtersParam: FiltersParamType }> = ({ filtersParam }) => {
  return (
    <div className="d-flex flex-nowrap mt-1">
      {filtersParam.filter.prefixLabel}
      {filtersParam.values.map((v, i) => (
        <FilterValue key={i} selected={true} filterParams={filtersParam} value={v} />
      ))}
    </div>
  );
};

export default SelectedFilterValues;
