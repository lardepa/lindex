import React from "react";
import { MapContainer, TileLayer, Popup, Polyline, Marker } from "react-leaflet";
import config from "../../config";
import { LieuType } from "../../types";
import { LatLngExpression } from "leaflet";

// FYI: default leaflet icon can't be used without a workaround: https://github.com/PaulLeCam/react-leaflet/issues/453
// anyway we use custom icons

import { Media } from "../media/media";
import { MarkerIcon } from "./marker-icon";
import { CenterMap } from "./center-map";
import { LinkPreview } from "../link-preview";
import { prettyPrintValueList } from "../../utils";

interface MapProps {
  lieux: LieuType[];
  className?: string;
  itinary?: boolean;
}

export const Map: React.FC<MapProps> = (props) => {
  const { lieux, className, itinary } = props;

  // TODO: Change marker pixels size according to zoom? https://jsfiddle.net/falkedesign/nobapxvd/

  return (
    <MapContainer center={[47.207562, -1.557635]} zoom={15} scrollWheelZoom={true} className={className}>
      <CenterMap lieux={lieux} />
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
              <LinkPreview to={`/lieu/${lieu.id}`}>
                <h4>{lieu.nom}</h4>
              </LinkPreview>
              <div className="metadata">
                <div>
                  {lieu.maitre_oeuvre && (
                    <span className="field">
                      <span className="label">Maître d'œuvre</span>{" "}
                      <span className="info">{prettyPrintValueList(lieu.maitre_oeuvre?.map((m) => m.nom))}</span>
                    </span>
                  )}
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
