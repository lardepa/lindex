import { every, flatten, some, sortBy, sortedUniq } from "lodash";
import React, { useEffect, useState } from "react";
import { PageLayout } from "../components/layout/page-layout";
import { Loader } from "../components/loader";
import { Map } from "../components/map/map";
import { useQueryParamsState } from "../hooks/queryParams";
import { useGetList } from "../hooks/useAPI";
import { LieuType } from "../types";
import { FilterType } from "../types.frontend";

import FilterModal from "../components/filters/filter-modal";
import FiltersMenu from "../components/filters/filters-menu";
import FiltersStatusBar from "../components/filters/filters-status-bar";
import filtersConfig from "../filters-config";

export const ExplorePage: React.FC<{}> = () => {
  // main data
  const [lieux, loading] = useGetList<LieuType>("lieux");
  const [filteredLieux, setFilteredLieux] = useState<LieuType[] | null>(null);
  // filters params
  const [queryParamsState] = useQueryParamsState();
  const { filtersParams } = queryParamsState;

  const [filterForPicker, showFilterPicker] = useState<FilterType | null>(null);
  const [responsiveFilterMenu, showResponsiveFilterMenu] = useState<boolean>(false);
  const [filtersOptions, setFiltersOptions] = useState<{ [filterKey: string]: string[] }>({});

  // filter lieux
  useEffect(() => {
    if (lieux && filtersParams.length > 0)
      setFilteredLieux(
        lieux.filter(
          (l) =>
            l.geolocalisation &&
            every(filtersParams, ({ filter, values }) =>
              some(filter.getValueFromLieu(l), (v: string) => values.includes(v)),
            ),
        ),
      );
    if (lieux && filtersParams.length === 0)
      setFilteredLieux(lieux.filter((l) => l.geolocalisation && l.geolocalisation.length === 2));
  }, [lieux, filtersParams]);
  // index possible filter options from filteredLieux
  useEffect(() => {
    setFiltersOptions(
      filtersConfig.reduce((options, filter) => {
        const lieuxFilteredByOtherFilters = (lieux || []).filter(
          (l) =>
            l.geolocalisation &&
            every(
              filtersParams,
              ({ filter: filterP, values }) =>
                filterP === filter || some(filterP.getValueFromLieu(l), (v: string) => values.includes(v)),
            ),
        );

        return {
          ...options,
          // options are : all existing values in lieux filtered by other active filters
          [filter.key]: sortedUniq(
            sortBy(flatten((lieuxFilteredByOtherFilters || []).map((l) => filter.getValueFromLieu(l)))),
          ),
        };
      }, {}),
    );
  }, [lieux, filtersParams]);

  return (
    <>
      {filteredLieux && filterForPicker && (
        // Full screen Modal to change filter state
        <FilterModal
          filterParam={{
            filter: filterForPicker,
            values: filtersParams.find((f) => f.filter.key === filterForPicker.key)?.values || [],
          }}
          options={filtersOptions[filterForPicker.key]}
          onClose={() => showFilterPicker(null)}
        />
      )}
      {responsiveFilterMenu && (
        <div className="filter-modal" onClick={() => showResponsiveFilterMenu(false)}>
          {" "}
          <FiltersMenu
            filtersParams={filtersParams}
            filtersOptions={filtersOptions}
            showFilterPicker={(filter) => {
              showResponsiveFilterMenu(false);
              showFilterPicker(filter.filter);
            }}
          />
        </div>
      )}
      <PageLayout
        menuSelectedItem="explorer"
        gridLayoutName="explore-grid-area"
        leftContent={
          // Menu top open filters modals
          <div className="d-flex flex-grow-1 flex-column justify-content-end d-none d-sm-none d-md-flex">
            <FiltersMenu
              filtersParams={filtersParams}
              filtersOptions={filtersOptions}
              showFilterPicker={(f) => showFilterPicker(f.filter)}
            />
          </div>
        }
        rightContent={
          <>
            {filteredLieux && (
              <>
                {/* Current Filters Status Bar  */}
                <FiltersStatusBar nbSelectedLieux={filteredLieux.length} showMenu={showResponsiveFilterMenu} />
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
