import { LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { toPairs, uniq } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { HiInformationCircle } from "react-icons/hi";
import { GeoJSON, MapContainer, Marker, Polyline, Popup, ScaleControl, TileLayer, ZoomControl } from "react-leaflet";

import config from "../../config";
import { DestinationType, LieuType } from "../../types";
import { Media } from "../media/media";
// FYI: default leaflet icon can't be used without a workaround: https://github.com/PaulLeCam/react-leaflet/issues/453
// anyway we use custom icons
import { GeoJsonObject } from "geojson";
import Control from "react-leaflet-custom-control";
import { MetadataField } from "../lieu/lieu";
import { LinkPreview } from "../link-preview";
import { LocateControl } from "./LocateControl";
import { NavigateTo } from "./NavigateTo";
import { ResetZoomToBoundingBox } from "./ResetZoomToBoundingBox";
import { CenterMap } from "./center-map";
import { DestinationSVG, MarkerIcon } from "./marker-icon";
interface MapProps {
  lieux: LieuType[];
  className?: string;
  itinaries?: Record<string, Pick<LieuType, "id" | "geolocalisation">[]>;
  disableScroll?: boolean;
  setOverLieu?: (idLieu: string | null) => void;
  highlightedLieux?: Set<string>;
}

export const Map: React.FC<MapProps> = (props) => {
  const { lieux, className, itinaries, disableScroll, setOverLieu, highlightedLieux } = props;

  const [contours, setContours] = useState<GeoJsonObject | null>(null);

  // TODO: Change marker pixels size according to zoom? https://jsfiddle.net/falkedesign/nobapxvd/

  const eventHandlersFactory: (lieu: LieuType) => LeafletEventHandlerFnMap = useMemo(
    () => (lieu: LieuType) =>
      setOverLieu
        ? {
            mouseover: () => {
              setOverLieu(lieu.id);
            },
            mouseout() {
              setOverLieu(null);
            },
          }
        : {},
    [setOverLieu],
  );

  useEffect(() => {
    if (contours === null) {
      fetch(`${import.meta.env.BASE_URL}234400034_contours-paysdelaloire.json`)
        .then((response) => {
          if (response.status === 200) response.json().then((data) => setContours(data));
        })
        .catch((e) => console.log("can't retrieve contours", e));
    }
  }, [contours, setContours]);

  return (
    lieux && (
      <MapContainer
        center={[47.207562, -1.557635]}
        zoom={15}
        scrollWheelZoom={!disableScroll}
        className={className}
        zoomControl={false}
        attributionControl={false}
      >
        {/* MAP LEGEND */}
        <div className="leaflet-bottom leaflet-right map-legend">
          <ul className="list-unstyled">
            {(["Logement", "Équipement", "Espace public"] as DestinationType[]).map((typeDestination) => (
              <li key={typeDestination}>
                <img src={DestinationSVG(typeDestination)} alt={typeDestination} width={18} height={18} />{" "}
                {typeDestination}
              </li>
            ))}
          </ul>
        </div>
        <details className="map-attribution">
          <summary>
            <HiInformationCircle />{" "}
          </summary>
          <span dangerouslySetInnerHTML={{ __html: config.MAP_LAYERS[config.MAP_LAYER].TILE_CREDITS }} />
        </details>
        <CenterMap lieux={lieux} />
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" metric={true} imperial={false} />
        <Control position="topright">
          <ResetZoomToBoundingBox lieux={lieux} />
        </Control>
        {(isMobile || isTablet) && <LocateControl position="topright" showPopup={false} />}
        <TileLayer url={config.MAP_LAYERS[config.MAP_LAYER].TILE_URL} />
        {lieux
          .filter((lieu) => lieu.geolocalisation)
          .map((lieu) => (
            <Marker
              key={lieu.id}
              icon={MarkerIcon(
                lieu.type[0]?.type_destination,
                !highlightedLieux || highlightedLieux.size === 0 || highlightedLieux.has(lieu.id) ? "" : "unselected",
              )}
              position={lieu.geolocalisation as LatLngExpression}
              eventHandlers={eventHandlersFactory(lieu)}
            >
              <Popup className="lieu-popup" maxWidth={500}>
                <LinkPreview className="d-flex flex-column" to={`/lieux/${lieu.id}`}>
                  <h5>{lieu.nom}</h5>

                  {lieu.cover_media && (
                    <Media
                      media={lieu.cover_media}
                      cover
                      forceRatio="force-width"
                      sizes="(max-width:576px) 80vw, (max-width:768px) 300px, (min-width:768px) 400px"
                    />
                  )}
                </LinkPreview>
                <div className="metadata-panel">
                  {lieu.maitre_oeuvre && (
                    <MetadataField
                      filterKey="moeuvre"
                      label="Maître d'œuvre"
                      value={lieu.maitre_oeuvre.map((m) => m.nom)}
                    />
                  )}
                  {lieu.date && <MetadataField filterKey="date" label="Date" value={lieu.date} noLink />}
                  {lieu.type && (
                    <>
                      {/* <MetadataField
                          filterKey="type"
                          label="Typologie"
                          value={uniq(lieu.type.map((t) => t.type_destination))}
                        /> */}
                      <MetadataField
                        filterKey="programme"
                        label="Programme"
                        value={uniq(lieu.type.map((t) => t.destination))}
                      />
                    </>
                  )}

                  {/* {lieu.distinctions && (
                      <MetadataField filterKey="dist" label="Distinction" value={lieu.distinctions.map((d) => d.nom)} />
                    )} */}
                </div>

                <NavigateTo lieu={lieu} className="navigate-action border" />
              </Popup>
            </Marker>
          ))}
        {itinaries &&
          toPairs(itinaries).map(([parcoursId, lieux]) => (
            <Polyline
              key={parcoursId}
              pathOptions={{
                color:
                  !highlightedLieux || highlightedLieux.size === 0 || lieux.every((l) => highlightedLieux.has(l.id))
                    ? "hsl(220 97% 75%)"
                    : "hsl(220 0% 75%)",
                dashArray: "5,10",
                lineCap: "square",
              }}
              positions={lieux
                .filter((lieu) => lieu.geolocalisation)
                .map((lieu) => lieu.geolocalisation as LatLngExpression)}
            />
          ))}

        {contours && <GeoJSON data={contours} style={{ fill: false, color: "#313138", weight: 1 }} />}
      </MapContainer>
    )
  );
};
