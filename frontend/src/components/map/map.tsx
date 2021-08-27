import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import config from "../../config.json";
import { Lieu } from "../../types";
import { LatLngExpression } from "leaflet";

// FYI: default leaflet icon can't be used without a workaround: https://github.com/PaulLeCam/react-leaflet/issues/453
// anyway we use custom icons
import { PurpleIcon } from "./marker-icon";
// TODO: import three icons for the three type_lieu

interface MapProps {
  lieux: Lieu[];
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
        url={`https://api.maptiler.com/maps/voyager/{z}/{x}/{y}.png?key=${config.MAP_KEY}`}
      />
      {lieux
        .filter((lieu) => lieu.geolocalisation)
        .map((lieu) => (
          <Marker position={lieu.geolocalisation as LatLngExpression} icon={PurpleIcon}>
            <Popup>{lieu.nom}</Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};
