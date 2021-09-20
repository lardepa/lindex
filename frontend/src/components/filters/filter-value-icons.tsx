import React from "react";

import LogementSVG from "../../assets/logement.svg";
import EquipementSVG from "../../assets/equipement.svg";
import EspacePublicSVG from "../../assets/espace_public.svg";

const FilterValueIcons: React.FC<{ filterKey: string; value: string }> = ({ filterKey, value }) => {
  if (filterKey !== "type") return null;
  switch (value) {
    case "Logement":
      return <img src={LogementSVG} alt="Logement" />;
    case "Équipement":
      return <img src={EquipementSVG} alt="Équipement" />;
    case "Espace Public":
      return <img src={EspacePublicSVG} alt="Espace Public" />;
    default:
      return null;
  }
};

export default FilterValueIcons;
