import React from "react";
import { FiltersParamType } from "../../types.frontend";
import FilterValue from "./filter-value";

const FilterModal: React.FC<{
  filterParam: FiltersParamType;
  options: string[];
  onClose: () => void;
}> = ({ filterParam, options, onClose }) => {
  return (
    <div className="filter-modal" onClick={onClose}>
      <div className="filter">
        <h2>{filterParam.filter.label}</h2>
        <div className="filter-values">
          {options.map((v, i) => (
            <FilterValue key={i} value={v} filterParams={filterParam} selected={filterParam.values.includes(v)} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default FilterModal;
