import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import config from "../../config.json";
import { LieuType } from "../../types";
import { LatLngExpression } from "leaflet";

// FYI: default leaflet icon can't be used without a workaround: https://github.com/PaulLeCam/react-leaflet/issues/453
// anyway we use custom icons
import { PurpleIcon } from "./marker-icon";
import { Media } from "../media";
import { Link } from "react-router-dom";
// TODO: import three icons for the three type_lieu

interface MapProps {
  lieux: LieuType[];
  className?: string;
}

export const Map: React.FC<MapProps> = (props) => {
  const { lieux, className } = props;
  // TODO: calculate boudning box
  // TODO: add a polygon option to trace "parcours"
  return (
    <MapContainer center={[47.207562, -1.557635]} zoom={15} scrollWheelZoom={true} className={className}>
      <TileLayer
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url={`https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=${config.MAP_KEY}`}
      />
      {lieux
        .filter((lieu) => lieu.geolocalisation)
        .map((lieu) => (
          <Marker position={lieu.geolocalisation as LatLngExpression} icon={PurpleIcon}>
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
    </MapContainer>
  );
};
