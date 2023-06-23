import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { LieuType } from "../../types";
import { useCenterMap } from "../../hooks/useCenterMap";

export const CenterMap = (props: { lieux: LieuType[] }) => {
  const map = useMap();
  const { lieux } = props;
  const { centerMap } = useCenterMap({ lieux, map });
  useEffect(centerMap, [centerMap]);

  return null;
};
