import L from "leaflet";
import { DestinationType } from "../../types";
import equipementSVG from "./equipement.svg";
import logementSVG from "./logement.svg";
import espacePublicSVG from "./espace_public.svg";

const DestinationSVG = (destination: DestinationType | undefined): any => {
  switch (destination) {
    case "Logement":
      return logementSVG;
    case "Équipement":
      return equipementSVG;
    case "Espace public":
      return espacePublicSVG;
    default:
      return equipementSVG;
  }
};

const leafletICon = (SVGURL: any) =>
  new L.Icon({
    iconUrl: SVGURL,
    iconRetinaUrl: SVGURL,
    iconSize: new L.Point(12, 12),
  });

const MarkerIcon = (destination: DestinationType | undefined) => {
  return leafletICon(DestinationSVG(destination));
};

export { MarkerIcon, DestinationSVG };
