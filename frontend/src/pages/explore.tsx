import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { LieuType } from "../types";
import config from "../config";
import { every, flatten, some, sortedUniq, uniq } from "lodash";
import { Map } from "../components/map/map";
import filtersConfig from "../filters-config";
import { FiltersParamType } from "../types.frontend";
import { useQueryParamsState } from "../hooks/queryParams";
import { PageLayout } from "../components/layout/page-layout";
import { previewURL } from "../components/link-preview";

const SelectedFilterValues: React.FC<{ filtersParam: FiltersParamType; deSelect: (value: string) => void }> = ({
  filtersParam,
  deSelect,
}) => (
  <>
    <span>{filtersParam.filter.prefixLabel}</span>{" "}
    {filtersParam.values.map((v) => (
      <button
        className="btn filter-value"
        onClick={() => {
          deSelect(v);
        }}
      >
        {v}
      </button>
    ))}
  </>
);

export const ExplorePage: React.FC<{}> = () => {
  // main data
  const [lieux, setLieux] = useState<LieuType[] | null>(null);
  const [filteredLieux, setFilteredLieux] = useState<LieuType[] | null>(null);
  // filters params
  const [queryParamsState, setQueryParamsState] = useQueryParamsState();
  const { filtersParams, isPreview } = queryParamsState;

  useEffect(() => {
    get(previewURL(`${config.DATA_URL}/lieux.json`, isPreview), { responseType: "json" })
      .then((response) => {
        setLieux(response.data);
      })
      //TODO: build filters values index here
      .catch((error) => console.error(error));
  }, [isPreview]);

  const [filterForPicker, showFilterPicker] = useState<FiltersParamType | null>(null);

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

  return (
    <>
      {lieux && filterForPicker && (
        <div className="filter-modal" onClick={() => showFilterPicker(null)}>
          <div className="filter">
            <h2>{filterForPicker.filter.label}</h2>
            <div className="filter-values">
              {sortedUniq(flatten(lieux.map((l) => filterForPicker.filter.getValueFromLieu(l)))).map((v, i) => (
                <button
                  disabled={filterForPicker.values.includes(v)}
                  key={i}
                  className="btn filter-value"
                  onClick={() => {
                    // update filters in URL's search params)
                    const newFilters: FiltersParamType[] = [
                      //other filters
                      ...filtersParams.filter(({ filter, values }) => filter.key !== filterForPicker.filter.key),
                      // add one value to the picker filter
                      { ...filterForPicker, values: uniq([...filterForPicker.values, v]) },
                    ];
                    setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <PageLayout
        menuSelectedItem="explorer"
        leftContent={
          <div className="d-flex flex-grow-1 flex-column justify-content-center">
            <div className="menu">
              {filtersConfig.map((filter) => (
                <div
                  onClick={() => {
                    const filterParams = filtersParams.find((fp) => fp.filter.key === filter.key);
                    showFilterPicker({ filter, values: filterParams?.values || [] });
                  }}
                >
                  {filter.label}
                </div>
              ))}
            </div>
          </div>
        }
        rightContent={
          <>
            {filteredLieux && (
              <>
                <div className="filters-status-bar">
                  {filteredLieux.length} {!filtersParams.find(({ filter }) => filter.key === "use") && "lieux"}
                  {filtersParams.map((f) => (
                    <SelectedFilterValues
                      filtersParam={f}
                      deSelect={(value: string) => {
                        // update filters in URL's search params)
                        const newFilters: FiltersParamType[] = [
                          //other filters
                          ...filtersParams.filter(({ filter }) => filter.key !== f.filter.key),
                          // add one value to the picker filter
                          { ...f, values: f.values.filter((v) => v !== value) },
                        ];
                        setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
                      }}
                    />
                  ))}
                </div>
                <div className="flex-grow-1">
                  <Map lieux={filteredLieux} className="explore-map" />
                </div>
              </>
            )}
          </>
        }
      />
    </>
  );
};
