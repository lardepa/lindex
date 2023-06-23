import { useCallback, useMemo } from "react";
import { LieuType } from "../types";
import { LatLngBoundsLiteral, LatLngExpression, Map } from "leaflet";
import { max, min } from "lodash";

export const useCenterMap = ({ lieux, map }: { lieux: LieuType[]; map: Map }) => {
  const centerBoundingBox = useMemo(() => {
    // calculate bounds of lieux geo points
    const { lats, lngs } = lieux.reduce(
      (all: { lats: number[]; lngs: number[] }, lieu: LieuType) => {
        if (lieu.geolocalisation)
          return { lats: [...all.lats, lieu.geolocalisation[0]], lngs: [...all.lngs, lieu.geolocalisation[1]] };
        else return all;
      },
      { lats: [], lngs: [] },
    );
    let bounds: LatLngBoundsLiteral | undefined = undefined;

    if (lats && lats.length > 0 && lngs && lngs.length > 0) {
      // if we have geolocalized points, fit to those
      bounds = [];
      bounds.push([min(lats) as number, max(lngs) as number]);
      bounds.push([max(lats) as number, min(lngs) as number]);
    }
    return bounds;
  }, [lieux]);

  const centerMap = useCallback(() => {
    // bounds works only if we have more than one geoloc
    if (
      centerBoundingBox &&
      (centerBoundingBox[0][0] !== centerBoundingBox[1][0] || centerBoundingBox[0][1] !== centerBoundingBox[1][1])
    ) {
      map.fitBounds(centerBoundingBox as LatLngBoundsLiteral);
    } else {
      // if only one poitn center on it
      if (centerBoundingBox) map.setView(centerBoundingBox[0] as LatLngExpression);
      //if no point center on arbitrary center on Nantes
      else map.setView([47.207562, -1.557635] as LatLngExpression, 15);
    }
  }, [centerBoundingBox, map]);

  return { centerMap, centerBoundingBox };
};
