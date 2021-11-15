import React from "react";
import { FiltersParamType } from "../../types.frontend";
import filtersConfig from "../../filters-config";
import PlusSVG from "../../assets/plus.svg";

const FiltersMenu: React.FC<{
  filtersParams: FiltersParamType[];
  filtersOptions: { [filterKey: string]: string[] };
  showFilterPicker: (filterParams: FiltersParamType) => void;
}> = ({ filtersParams, showFilterPicker, filtersOptions }) => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <h4 className="px-3 pt-3">Filtres</h4>
      <div className="vertical-menu">
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
                <span>
                  {filter.label}{" "}
                  {filterParams && filterParams?.values.length !== 0 ? `(${filterParams?.values.length})` : ""}
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
