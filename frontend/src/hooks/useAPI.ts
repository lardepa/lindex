import get from "axios";
import { useEffect, useState } from "react";
import config from "../config";
import { useQueryParamsState } from "./queryParams";

const useGetData = <Data>(
  modelName: "lieux" | "parcours" | "selections" | "news" | "a_propos" | "mentions_legales",
  id?: string,
): [data: Data | null, loading: boolean] => {
  const [data, setData] = useState<Data | null>(null);
  const [{ isPreview }] = useQueryParamsState();
  const [loading, setLoading] = useState<boolean>(false);
  //TODO: handle  error correctly
  useEffect(() => {
    setData(null);
    setLoading(true);
    const url: string = id
      ? `${config.DATA_URL}/${modelName}/${id}.json`
      : `${config.DATA_URL}/${modelName}${isPreview ? "_preview" : ""}.json`;
    get(url, { responseType: "json" })
      .then((response) => {
        setLoading(false);
        setData(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [isPreview, modelName, id]);
  return [data, loading];
};

export const useGetList = <Data>(
  modelName: "lieux" | "parcours" | "selections" | "news" | "a_propos" | "mentions_legales",
): [data: Data[] | null, loading: boolean] => {
  return useGetData<Data[]>(modelName);
};

export const useGetOne = <Data>(
  modelName: "lieux" | "parcours" | "selections",
  id: string,
): [data: Data | null, loading: boolean] => {
  return useGetData<Data>(modelName, id);
};
