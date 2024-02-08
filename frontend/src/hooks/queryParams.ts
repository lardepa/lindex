import { flatten, sortBy } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import filtersConfig from "../filters-config";
import { FiltersParamType, QueryParamsState } from "../types.frontend";

export const useQueryParamsState = (): [QueryParamsState, (queryParamsState: QueryParamsState) => void] => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  // create state
  const [queryParamsState, setQueryParamsState] = useState<QueryParamsState>(queryStringToQueryParamsState(query));

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setQueryParamsState(queryStringToQueryParamsState(query));
  }, [location.search]);

  // update state effect
  // TODO: understand why this pattern fails...
  // useEffect(() => {
  //   console.log("in set query effect", queryParamsState);
  //   history.push({
  //     search: queryParamsStateToQueryString(queryParamsState),
  //   });
  // }, values(queryParamsState));

  return [
    queryParamsState,
    //Kind of a hack till I understand the issue
    (newQueryState: QueryParamsState) => {
      navigate({
        search: queryParamsStateToQueryString(newQueryState),
      });
    },
  ];
};

const queryParamsStateToQueryString = (state: QueryParamsState): string => {
  const { filtersParams, isPreview } = state;

  let query = new URLSearchParams(
    sortBy(flatten(filtersParams.map(({ filter, values }) => values.map((value) => [filter.key, value])))),
  );

  if (isPreview) query.append("preview", "");

  return query.toString();
};

const queryStringToQueryParamsState = (query: URLSearchParams): QueryParamsState => {
  // get filters params
  const filtersParams: FiltersParamType[] = [];
  filtersConfig.forEach((f) => {
    const values = query.getAll(f.key);
    if (values && values.length > 0) filtersParams.push({ filter: f, values });
  });
  // get preview
  const isPreview = query.get("preview") === "";
  const selection = query.get("selection") || undefined;
  const parcours = query.get("parcours") || undefined;

  return { filtersParams, isPreview, selection, parcours };
};

// //utils for filter (de)selection
// TODO: keep this for review to delete

// const makeSelectFilterValue = (
//   queryParamsState: QueryParamsState,
//   setQueryParamsState: (q: QueryParamsState) => void,
// ) => {
//   return (value: string, filterParam: FiltersParamType) => {
//     // update filters in URL's search params)
//     const newFilters: FiltersParamType[] = [
//       //other filters
//       ...queryParamsState.filtersParams.filter(({ filter, values }) => filter.key !== filterParam.filter.key),
//       // add one value to the picker filter
//       { ...filterParam, values: uniq([...filterParam.values, value]) },
//     ];
//     console.log(value, filterParam, newFilters, queryParamsState);
//     setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
//   };
// };
// const makeDeSelectFilterValue =
//   (queryParamsState: QueryParamsState, setQueryParamsState: (q: QueryParamsState) => void) =>
//   (value: string, filterParam: FiltersParamType) => {
//     // update filters in URL's search params)
//     const newFilters: FiltersParamType[] = [
//       //other filters
//       ...queryParamsState.filtersParams.filter(({ filter }) => filter.key !== filterParam.filter.key),
//       // remove one value to the picker filter
//       { ...filterParam, values: filterParam.values.filter((v) => v !== value) },
//     ];
//     setQueryParamsState({ ...queryParamsState, filtersParams: newFilters });
//   };

// export const useFilterValueSelection = (): [
//   (value: string, filterParam: FiltersParamType) => void,
//   (value: string, filterParam: FiltersParamType) => void,
// ] => {
//   const [queryParamsState, setQueryParamsState] = useQueryParamsState();
//   return [
//     makeSelectFilterValue(queryParamsState, setQueryParamsState),
//     makeDeSelectFilterValue(queryParamsState, setQueryParamsState),
//   ];
//   // const [selectFilterValue, setSelectFilterValue] = useState<(value: string, filterParam: FiltersParamType) => void>(
//   //   makeSelectFilterValue(queryParamsState, setQueryParamsState),
//   // );
//   // const [deSelectFilterValue, setDeSelectFilterValue] = useState<
//   //   (value: string, filterParam: FiltersParamType) => void
//   // >(makeDeSelectFilterValue(queryParamsState, setQueryParamsState));
//   // useEffect(() => {
//   //   setSelectFilterValue(makeSelectFilterValue(queryParamsState, setQueryParamsState));
//   //   setDeSelectFilterValue(makeDeSelectFilterValue(queryParamsState, setQueryParamsState));
//   // // }, [queryParamsState, setQueryParamsState]);
//   // return [selectFilterValue, deSelectFilterValue];
// };
