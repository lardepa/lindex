import React from "react";
import { FiltersParamType } from "../../types.frontend";
import FilterValue from "./filter-value";

const SelectedFilterValues: React.FC<{ filtersParam: FiltersParamType; plural: boolean }> = ({
  filtersParam,
  plural,
}) => {
  return (
    <div className="d-flex flex-nowrap mt-1">
      {filtersParam.filter.prefixLabel ? filtersParam.filter.prefixLabel(plural) : null}
      {filtersParam.values.map((v, i) => (
        <FilterValue key={i} selected={true} filterParams={filtersParam} value={v} />
      ))}
    </div>
  );
};

export default SelectedFilterValues;
