import get from "axios";
import { useEffect, useState } from "react";
import config from "../config";
import { useQueryParamsState } from "./queryParams";

export const useGetList = <Data>(modelName: "lieux" | "parcours" | "selections"): Data[] => {
  const [{ isPreview }] = useQueryParamsState();
  const [data, setData] = useState<Data[]>([]);
  //TODO: handle loading and error correctly
  useEffect(() => {
    get(`${config.DATA_URL}/${modelName}${isPreview ? "_preview" : ""}.json`, { responseType: "json" })
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  }, [isPreview, modelName]);
  return data;
};

export const useGetOne = <Data>(modelName: "lieux" | "parcours" | "selections", id: string): Data | null => {
  const [data, setData] = useState<Data | null>(null);
  //TODO: handle loading and error correctly
  useEffect(() => {
    get(`${config.DATA_URL}/${modelName}/${id}.json`, { responseType: "json" })
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  }, [id, modelName]);
  return data;
};
