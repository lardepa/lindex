import L from "leaflet";
import markerIconPurple from "./markerIconPurple.svg";

const PurpleIcon = new L.Icon({
  iconUrl: markerIconPurple,
  iconRetinaUrl: markerIconPurple,
  iconSize: new L.Point(12, 12),
});

export { PurpleIcon };
