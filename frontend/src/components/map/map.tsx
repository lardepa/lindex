import React from "react";
import { MapContainer, TileLayer, Popup, Polyline, Marker } from "react-leaflet";
import config from "../../config";
import { LieuType } from "../../types";
import { LatLngExpression } from "leaflet";

// FYI: default leaflet icon can't be used without a workaround: https://github.com/PaulLeCam/react-leaflet/issues/453
// anyway we use custom icons

import { Media } from "../media";
import { Link } from "react-router-dom";
import { max, min } from "lodash";
import { MarkerIcon } from "./marker-icon";

interface MapProps {
  lieux: LieuType[];
  className?: string;
  itinary?: boolean;
}

export const Map: React.FC<MapProps> = (props) => {
  const { lieux, className, itinary } = props;

  // TODO: Change marker pixels size according to zoom? https://jsfiddle.net/falkedesign/nobapxvd/

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

  return (
    <MapContainer bounds={bounds} center={center} zoom={zoom} scrollWheelZoom={true} className={className}>
      <TileLayer
        attribution={config.MAP_LAYERS[config.MAP_LAYER].TILE_CREDITS}
        url={config.MAP_LAYERS[config.MAP_LAYER].TILE_URL}
      />
      {lieux
        .filter((lieu) => lieu.geolocalisation)
        .map((lieu) => (
          <Marker
            key={lieu.id}
            icon={MarkerIcon(lieu.type.type_destination)}
            position={lieu.geolocalisation as LatLngExpression}
          >
            <Popup className="lieu-popup">
              {lieu.cover_media && <Media media={lieu.cover_media} />}
              <Link to={`/lieu/${lieu.id}`}>
                <h4>{lieu.nom}</h4>
              </Link>
              <div className="metadata">
                <div>
                  <span className="field">
                    <span className="label">Maître d'œuvre</span>{" "}
                    <span className="info">{lieu.maitre_oeuvre?.nom}</span>
                  </span>
                  <span className="field">
                    <span className="label">Date</span> <span className="info">{lieu.date}</span>
                  </span>
                </div>
                <div>
                  {" "}
                  <span className="field">
                    <span className="label">Typologie</span> <span className="info">{lieu.type?.destination}</span>
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      {itinary && (
        <Polyline
          pathOptions={{ color: "black" }}
          positions={lieux
            .filter((lieu) => lieu.geolocalisation)
            .map((lieu) => lieu.geolocalisation as LatLngExpression)}
        />
      )}
    </MapContainer>
  );
};
