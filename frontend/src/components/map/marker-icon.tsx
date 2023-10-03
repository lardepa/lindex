import L from "leaflet";
import { DestinationType } from "../../types";
import equipementSVG from "./equipement.svg";
import espacePublicSVG from "./espace_public.svg";
import logementSVG from "./logement.svg";
import undefinedSVG from "./undefined.svg";

const DestinationSVG = (destination: DestinationType | undefined): any => {
  switch (destination) {
    case "Logement":
      return logementSVG;
    case "Équipement":
      return equipementSVG;
    case "Espace public":
      return espacePublicSVG;
    default:
      return undefinedSVG;
  }
};

const leafletICon = (SVGURL: any, className?: string) =>
  new L.Icon({
    iconUrl: SVGURL,
    iconRetinaUrl: SVGURL,
    iconSize: new L.Point(18, 18),
    className,
  });

const MarkerIcon = (destination: DestinationType | undefined, className?: string) => {
  return leafletICon(DestinationSVG(destination), className);
};

export { DestinationSVG, MarkerIcon };
