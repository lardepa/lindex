import React from "react";
import PlusSVG from "../../assets/plus.svg";
import filtersConfig from "../../filters-config";
import { FiltersParamType } from "../../types.frontend";

const FiltersMenu: React.FC<{
  filtersParams: FiltersParamType[];
  filtersOptions: { [filterKey: string]: string[] };
  showFilterPicker: (filterParams: FiltersParamType) => void;
}> = ({ filtersParams, showFilterPicker, filtersOptions }) => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <h4 className="px-3 pt-3">Filtres</h4>
      <div className="vertical-menu filters-menu">
        {filtersConfig
          .filter((filter) => !filter.hide)
          .map((filter) => {
            const filterParams = filtersParams.find((fp) => fp.filter.key === filter.key);
            const disable = filtersOptions[filter.key] && filtersOptions[filter.key].length === 0;
            return (
              <div
                key={filter.key}
                className={` menu-item d-flex justify-content-between align-items-center explorer-hover ${
                  disable ? "disabled" : ""
                }`}
                onClick={
                  disable
                    ? () => {}
                    : () => {
                        showFilterPicker({ filter, values: filterParams?.values || [] });
                      }
                }
              >
                <span className="flex-grow-1 d-flex align-items-center">
                  <img src={filter.pictoURL} alt={""} height="30px" className="me-2 filter-icon rounded" />
                  <span>{filter.label}</span>
                  {filterParams && filterParams?.values.length !== 0 && (
                    <span>
                      <span className={`active-badge badge rounded-circle ms-1  explorer`} title="Filtres actifs">
                        {filterParams?.values.length}
                        <span className="visually-hidden">Filtres actifs</span>
                      </span>
                    </span>
                  )}
                </span>

                {!disable && <img src={PlusSVG} alt="open filter" height="10px" />}
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default FiltersMenu;
