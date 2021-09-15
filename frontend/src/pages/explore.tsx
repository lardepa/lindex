import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LieuType } from "../types";
import { every, flatten, some, sortedUniq } from "lodash";
import { Map } from "../components/map/map";
import { FiltersParamType } from "../types.frontend";
import { useQueryParamsState } from "../hooks/queryParams";
import { PageLayout } from "../components/layout/page-layout";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";

import FiltersStatusBar from "../components/filters/filters-status-bar";
import FilterModal from "../components/filters/filter-modal";
import FiltersMenu from "../components/filters/filters-menu";
import filtersConfig from "../filters-config";

export const ExplorePage: React.FC<{}> = () => {
  // main data
  const [lieux, loading] = useGetList<LieuType>("lieux");
  const [filteredLieux, setFilteredLieux] = useState<LieuType[] | null>(null);
  // filters params
  const [queryParamsState] = useQueryParamsState();
  const { filtersParams } = queryParamsState;

  const [filterForPicker, showFilterPicker] = useState<FiltersParamType | null>(null);
  const [filtersOptions, setFiltersOptions] = useState<{ [filterKey: string]: string[] }>({});

  // filter lieux
  useEffect(() => {
    if (lieux && filtersParams.length > 0)
      setFilteredLieux(
        lieux.filter((l) =>
          every(filtersParams, ({ filter, values }) =>
            some(filter.getValueFromLieu(l), (v: string) => values.includes(v)),
          ),
        ),
      );
    if (lieux && filtersParams.length === 0) setFilteredLieux(lieux);
  }, [lieux, filtersParams]);
  // index possible filter options from filteredLieux
  useEffect(() => {
    setFiltersOptions(
      filtersConfig.reduce((options, filter) => {
        const filterParams = filtersParams.find((f) => f.filter.key === filter.key);
        const selectedValues = filterParams ? filterParams.values : [];
        return {
          ...options,
          // options are : selected values (to allow unselect) + other available values in remaining lieux
          [filter.key]: sortedUniq(
            selectedValues.concat(flatten((filteredLieux || []).map((l) => filter.getValueFromLieu(l)))),
          ),
        };
      }, {}),
    );
  }, [filteredLieux, filtersParams]);

  return (
    <>
      {filteredLieux && filterForPicker && (
        // Full screen Modal to change filter state
        <FilterModal
          filterParam={filterForPicker}
          options={filtersOptions[filterForPicker.filter.key]}
          onClose={() => showFilterPicker(null)}
        />
      )}
      <PageLayout
        menuSelectedItem="explorer"
        gridLayoutName="explore-grid-area"
        leftContent={
          // Menu top open filters modals
          <div className="d-flex flex-grow-1 flex-column justify-content-center">
            <FiltersMenu
              filtersParams={filtersParams}
              filtersOptions={filtersOptions}
              showFilterPicker={showFilterPicker}
            />
          </div>
        }
        rightContent={
          <>
            {filteredLieux && (
              <>
                {/* Current Filters Status Bar  */}
                <FiltersStatusBar nbSelectedLieux={filteredLieux.length} />
                <div style={{ gridArea: "main-content" }}>
                  {!loading && <Map lieux={filteredLieux} className="explore-map" />}
                  <Loader loading={loading} />
                </div>
              </>
            )}
          </>
        }
      />
    </>
  );
};
