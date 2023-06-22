import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TbArrowBack } from "react-icons/tb";

import { FiltersParamType } from "../../types.frontend";
import FilterValue from "./filter-value";
import { SelectAllValues } from "./select-all-values";

const FilterModal: React.FC<{
  filterParam?: FiltersParamType;
  options: string[];
  onClose: () => void;
}> = ({ filterParam, options, onClose }) => {
  const [optionFilter, setOptionFilter] = useState<string>("");

  const filteredOptions = useMemo(() => {
    let filteredOptions = [...options];
    if (filterParam && filterParam.values.length > 0) {
      // some options selected before might have been discarded by other filter
      // we reinject them for consistency
      const deprecatedSelectedOptions = filterParam.values.filter((v) => !filteredOptions.includes(v));
      filteredOptions = [...filteredOptions, ...deprecatedSelectedOptions];
    }
    if (optionFilter !== "") filteredOptions = filteredOptions.filter((o) => o.toLowerCase().includes(optionFilter));

    return filteredOptions.sort();
  }, [options, optionFilter, filterParam]);

  const isOptionsFilterActive = options.length > 15;

  if (!filterParam) return null;

  return (
    <div className="filter-modal" onClick={onClose}>
      <div className="filter" style={{ justifyContent: isOptionsFilterActive ? "start" : "center" }}>
        <h2 className="d-flex align-items-center">
          <img src={filterParam.filter.pictoURL} alt={""} height="30px" className="me-2" />
          <span>{filterParam.filter.label}</span>
        </h2>
        {isOptionsFilterActive && (
          <div className="input-filter input-group mb-3" onClick={(e) => e.stopPropagation()}>
            <div className="input-group-prepend">
              <span className="input-group-text">
                <FaSearch />{" "}
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              aria-label="Champs texte pour filtrer la liste des options"
              placeholder="entrer du texte pour filtrer les options..."
              onChange={(e) => setOptionFilter(e.target.value)}
            />
          </div>
        )}

        <div className="filter-values" onClick={(e) => e.stopPropagation()}>
          {filteredOptions.map((v, i) => (
            <FilterValue key={i} value={v} filterParams={filterParam} selected={filterParam.values.includes(v)} />
          ))}
        </div>
        {filterParam.filter.selectAll && <SelectAllValues filterParams={filterParam} options={filteredOptions} />}
        {isOptionsFilterActive && (
          <button className="btn btn-light fw-bold" onClick={onClose}>
            <TbArrowBack size="1.5rem" /> Retour à la carte
          </button>
        )}
      </div>
    </div>
  );
};
export default FilterModal;
