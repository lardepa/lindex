import L from "leaflet";
import { DestinationType } from "../../types";
import equipementSVG from "./equipement.svg";
import logementSVG from "./logement.svg";
import espacePublicSVG from "./espace_public.svg";

const leafletICon = (SVGURL: any) =>
  new L.Icon({
    iconUrl: SVGURL,
    iconRetinaUrl: SVGURL,
    iconSize: new L.Point(12, 12),
  });

const MarkerIcon = (destination: DestinationType) => {
  switch (destination) {
    case "Logement":
      return leafletICon(logementSVG);
    case "Équipement":
      return leafletICon(equipementSVG);
    case "Espace public":
      return leafletICon(espacePublicSVG);
    default:
      return leafletICon(equipementSVG);
  }
};

export { MarkerIcon };
