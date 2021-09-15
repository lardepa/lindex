import React from "react";
import SelectedFilterValues from "./selected-filter-value";
import { useQueryParamsState } from "../../hooks/queryParams";

const FiltersStatusBar: React.FC<{ nbSelectedLieux: number }> = ({ nbSelectedLieux }) => {
  const [queryParamsState] = useQueryParamsState();
  const { filtersParams } = queryParamsState;
  return (
    <div className="filters-status-bar" style={{ gridArea: "status-bar" }}>
      <div className="m-1 ">
        {nbSelectedLieux}{" "}
        {!filtersParams.find(({ filter }) => filter.key === "type") && `lieu${nbSelectedLieux > 1 ? "x" : ""}`}
      </div>
      {filtersParams.map((f) => (
        <SelectedFilterValues key={f.filter.key} filtersParam={f} />
      ))}
    </div>
  );
};

export default FiltersStatusBar;
