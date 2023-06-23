import { isAndroid, isIOS } from "react-device-detect";
import { LieuType } from "../../types";
import { FC } from "react";
import { BiSolidNavigation } from "react-icons/bi";

const ZOOM_LEVEL = 19;

export const NavigateTo: FC<{ lieu: LieuType; className?: string }> = ({ lieu, className }) => {
  if (!lieu.geolocalisation) return null;

  let mapURL = `https://www.openstreetmap.org/directions?to=${encodeURIComponent(lieu.adresse)}#map=${ZOOM_LEVEL}/${
    lieu.geolocalisation[0]
  }/${lieu.geolocalisation[1]}`;
  if (isAndroid) mapURL = `geo://${lieu.geolocalisation.join(",")}?q=${encodeURIComponent(lieu.adresse)}`;
  if (isIOS) mapURL = `maps://${lieu.geolocalisation.join(",")}?q=${encodeURIComponent(lieu.adresse)}`;
  return (
    <a href={mapURL} className={`${className ? className : ""}`} title="Créer un itinéraire vers ce lieu">
      <BiSolidNavigation />
    </a>
  );
};
