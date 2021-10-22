import { LatLngBoundsLiteral, LatLngExpression } from "leaflet";
import { max, min } from "lodash";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LieuType } from "../../types";

export const CenterMap = (props: { lieux: LieuType[] }) => {
  const map = useMap();
  const { lieux } = props;
  useEffect(() => {
    // calculate bounds of lieux geo points
    const { lats, lngs } = lieux.reduce(
      (all: { lats: number[]; lngs: number[] }, lieu: LieuType) => {
        if (lieu.geolocalisation)
          return { lats: [...all.lats, lieu.geolocalisation[0]], lngs: [...all.lngs, lieu.geolocalisation[1]] };
        else return all;
      },
      { lats: [], lngs: [] },
    );
    let bounds: [number, number][] | undefined = undefined;
    let center: [number, number] | undefined = undefined;
    let zoom: number | undefined = undefined;
    if (lats && lats.length > 0 && lngs && lngs.length > 0) {
      // if we have geolocalized points, fit to those
      bounds = [];
      bounds.push([min(lats) as number, max(lngs) as number]);
      bounds.push([max(lats) as number, min(lngs) as number]);
    } else {
      // otherwise center on Nantes
      center = [47.207562, -1.557635];
      zoom = 15;
    }
    // bounds works only if we have more than one geoloc
    if (bounds && (bounds[0][0] !== bounds[1][0] || bounds[0][1] !== bounds[1][1])) {
      map.fitBounds(bounds as LatLngBoundsLiteral);
    } else {
      // if only one poitn center on it
      if (bounds) map.setView(bounds[0] as LatLngExpression, 23);
      //if no point center on arbitrary center
      else map.setView(center as LatLngExpression, zoom);
    }
  }, [lieux, map]);
  return null;
};
