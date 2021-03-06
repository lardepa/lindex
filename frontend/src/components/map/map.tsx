import React from "react";
import { MapContainer, TileLayer, Popup, Polyline, Marker, ScaleControl } from "react-leaflet";
import config from "../../config";
import { LieuType } from "../../types";
import { LatLngExpression } from "leaflet";

// FYI: default leaflet icon can't be used without a workaround: https://github.com/PaulLeCam/react-leaflet/issues/453
// anyway we use custom icons

import { Media } from "../media/media";
import { MarkerIcon } from "./marker-icon";
import { CenterMap } from "./center-map";
import { LinkPreview } from "../link-preview";
import { MetadataField } from "../lieu/lieu";
import { uniq } from "lodash";

interface MapProps {
  lieux: LieuType[];
  className?: string;
  itinary?: boolean;
  disableScroll?: boolean;
}

export const Map: React.FC<MapProps> = (props) => {
  const { lieux, className, itinary, disableScroll } = props;

  // TODO: Change marker pixels size according to zoom? https://jsfiddle.net/falkedesign/nobapxvd/

  return (
    <MapContainer center={[47.207562, -1.557635]} zoom={15} scrollWheelZoom={!disableScroll} className={className}>
      <CenterMap lieux={lieux} />
      <ScaleControl position="bottomleft" metric={true} imperial={false} />
      <TileLayer
        attribution={config.MAP_LAYERS[config.MAP_LAYER].TILE_CREDITS}
        url={config.MAP_LAYERS[config.MAP_LAYER].TILE_URL}
      />
      {lieux
        .filter((lieu) => lieu.geolocalisation)
        .map((lieu) => (
          <Marker
            key={lieu.id}
            icon={MarkerIcon(lieu.type[0]?.type_destination)}
            position={lieu.geolocalisation as LatLngExpression}
          >
            <Popup className="lieu-popup">
              <LinkPreview className="d-flex flex-column" to={`/lieux/${lieu.id}`}>
                <h5>{lieu.nom}</h5>

                {lieu.cover_media && <Media media={lieu.cover_media} cover forceRatio="force-width" />}
                <div className="metadata-panel">
                  {lieu.maitre_oeuvre && (
                    <MetadataField
                      filterKey="moeuvre"
                      label="Ma??tre d'??uvre"
                      value={lieu.maitre_oeuvre.map((m) => m.nom)}
                    />
                  )}
                  {lieu.date && <MetadataField filterKey="date" label="Date" value={lieu.date} noLink />}
                  {lieu.type && (
                    <>
                      <MetadataField
                        filterKey="type"
                        label="Typologie"
                        value={uniq(lieu.type.map((t) => t.type_destination))}
                      />
                      <MetadataField
                        filterKey="prog"
                        label="Programme"
                        value={uniq(lieu.type.map((t) => t.destination))}
                      />
                    </>
                  )}

                  {lieu.distinctions && (
                    <>
                      {lieu.distinctions.map((d, i) => (
                        <MetadataField filterKey="dist" key={i} label="R??compense" value={d.nom} />
                      ))}
                    </>
                  )}
                </div>
              </LinkPreview>
            </Popup>
          </Marker>
        ))}
      {itinary && (
        <Polyline
          pathOptions={{ color: "black", dashArray: "0 8" }}
          positions={lieux
            .filter((lieu) => lieu.geolocalisation)
            .map((lieu) => lieu.geolocalisation as LatLngExpression)}
        />
      )}
    </MapContainer>
  );
};
