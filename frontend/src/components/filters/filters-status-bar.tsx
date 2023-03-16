import React from "react";
import SelectedFilterValues from "./selected-filter-value";
import { useQueryParamsState } from "../../hooks/queryParams";
import FiltersMenuIcon from "./filters-menu-icon.svg";
const FiltersStatusBar: React.FC<{ nbSelectedLieux: number; showMenu?: (show: boolean) => void }> = ({
  nbSelectedLieux,
  showMenu,
}) => {
  const [queryParamsState] = useQueryParamsState();
  const { filtersParams } = queryParamsState;
  return (
    <div className="filters-status-bar" style={{ gridArea: "status-bar" }}>
      {showMenu && (
        <button className="btn show-filter-menu" onClick={() => showMenu(true)}>
          <img height="80%" src={FiltersMenuIcon} alt="filters menu" />
        </button>
      )}
      <div className="my-1 ms-2">
        {nbSelectedLieux}{" "}
        <span className={!filtersParams.find(({ filter }) => filter.key === "type") ? "d-inline" : "d-l-none"}>
          {`lieu${nbSelectedLieux > 1 ? "x" : ""}`}&nbsp;
        </span>
      </div>
      {filtersParams.map((f) => (
        <SelectedFilterValues key={f.filter.key} filtersParam={f} plural={nbSelectedLieux > 1} />
      ))}
    </div>
  );
};

export default FiltersStatusBar;
