import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { LieuType } from "../types";
import config from "../config";
import { every, flatten, some, sortedUniq, uniq, values } from "lodash";
import { Map } from "../components/map/map";
import { Logo } from "../components/logo";
import { useHistory, useLocation } from "react-router-dom";
import filtersConfig from "../filters-config";
import { FilterType } from "../types.frontend";

// FILTER DATA MANAGEMENT
interface FiltersParamType {
  filter: FilterType;
  values: string[];
}

const filtersToQueryString = (filtersParams: FiltersParamType[]): string => {
  return filtersParams
    .map(({ filter, values }) => `${encodeURIComponent(filter.key)}=${encodeURIComponent(values.join(","))}`)
    .join("&");
};
const queryToFilters = (query: URLSearchParams): FiltersParamType[] => {
  const filtersParams: FiltersParamType[] = [];
  filtersConfig.forEach((f) => {
    const param = query.get(f.key);
    if (param) filtersParams.push({ filter: f, values: param.split(",") });
  });
  return filtersParams;
};

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
  useEffect(() => {
    get(`${config.DATA_URL}/lieux.json`, { responseType: "json" })
      .then((response) => setLieux(values(response.data)))
      //TODO: build filters values index here
      .catch((error) => console.error(error));
  }, []);
  // filters params
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const filtersParams = queryToFilters(query);

  const [filterForPicker, showFilterPicker] = useState<FiltersParamType | null>(null);

  // filter lieux
  const filteredLieux: LieuType[] | null =
    lieux && filtersParams
      ? lieux.filter((l) =>
          every(filtersParams, ({ filter, values }) =>
            some(filter.getValueFromLieu(l), (v: string) => values.includes(v)),
          ),
        )
      : lieux;

  return (
    <>
      <div className="container-fluid" style={{ position: "relative" }}>
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
                      history.push({
                        search: filtersToQueryString(newFilters),
                      });
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {!filterForPicker && <Logo />}
        <div className="row full-height no-gutters">
          <div className="col-sm-6 col-xl-3 px-0 map-full-height overflow-scroll d-flex flex-column justify-content-start">
            <div className="d-flex flex-column" style={{ margin: "auto 0" }}>
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
          </div>
          <div className="col-sm-6 col-xl-9 px-0">
            {filteredLieux && (
              <div className="d-flex flex-column map-full-height">
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
                        history.push({
                          search: filtersToQueryString(newFilters),
                        });
                      }}
                    />
                  ))}
                </div>
                <div className="flex-grow-1">
                  <Map lieux={filteredLieux} className="explore-map" />
                </div>
              </div>
            )}
          </div>
          {/* TODO:add a loader here */}
        </div>
      </div>
    </>
  );
};
