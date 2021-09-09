import { sortBy } from "lodash";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import filtersConfig from "../filters-config";
import { FiltersParamType, QueryParamsState } from "../types.frontend";

export const useQueryParamsState = (): [QueryParamsState, (queryParamsState: QueryParamsState) => void] => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  // create state
  const [queryParamsState, setQueryParamsState] = useState<QueryParamsState>(queryStringToQueryParamsState(query));

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setQueryParamsState(queryStringToQueryParamsState(query));
  }, [location.search]);

  // update state effect
  useEffect(() => {
    history.push({
      search: queryParamsStateToQueryString(queryParamsState),
    });
  }, [queryParamsState, history]);

  return [queryParamsState, setQueryParamsState];
};

const queryParamsStateToQueryString = (state: QueryParamsState): string => {
  const { filtersParams, isPreview } = state;
  let query: string[] = sortBy(
    filtersParams.map(
      ({ filter, values }) => `${encodeURIComponent(filter.key)}=${encodeURIComponent(values.join(","))}`,
    ),
  );
  if (isPreview) query.push("preview");
  return query.join("&");
};

const queryStringToQueryParamsState = (query: URLSearchParams): QueryParamsState => {
  // get filters params
  const filtersParams: FiltersParamType[] = [];
  filtersConfig.forEach((f) => {
    const param = query.get(f.key);
    if (param) filtersParams.push({ filter: f, values: param.split(",") });
  });
  // get preview
  const isPreview = query.get("preview") === "";

  return { filtersParams, isPreview };
};
