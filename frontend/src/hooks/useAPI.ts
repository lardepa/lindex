import get from "axios";
import { useCallback, useEffect, useState } from "react";
import config from "../config";
import { useQueryParamsState } from "./queryParams";

const useGetData = <Data>(
  modelName: "lieux" | "parcours" | "selections" | "news" | "a_propos" | "glossaire",
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

export const useGetLasyData = <Data>(
  modelName: "lieux" | "parcours" | "selections" | "news" | "a_propos" | "mentions_legales",
  id?: string,
): { getData: () => Promise<Data | null>; loading: boolean } => {
  const [{ isPreview }] = useQueryParamsState();
  const [loading, setLoading] = useState<boolean>(false);
  //TODO: handle  error correctly
  const getData = useCallback(async (): Promise<Data | null> => {
    setLoading(true);
    const url: string = id
      ? `${config.DATA_URL}/${modelName}/${id}.json`
      : `${config.DATA_URL}/${modelName}${isPreview ? "_preview" : ""}.json`;
    try {
      const response = await get(url, { responseType: "json" });
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return null;
    }
  }, [isPreview, modelName, id]);
  return { getData, loading };
};

export const useGetList = <Data>(
  modelName: "lieux" | "parcours" | "selections" | "news" | "a_propos" | "glossaire",
): [data: Data[] | null, loading: boolean] => {
  return useGetData<Data[]>(modelName);
};

export const useGetOne = <Data>(
  modelName: "lieux" | "parcours" | "selections",
  id: string,
): [data: Data | null, loading: boolean] => {
  return useGetData<Data>(modelName, id);
};
