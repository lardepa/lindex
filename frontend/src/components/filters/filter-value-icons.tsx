import React from "react";

import EquipementSVG from "../map/equipement.svg";
import EspacePublicSVG from "../map/espace_public.svg";
import LogementSVG from "../map/logement.svg";

const FilterValueIcons: React.FC<{ filterKey: string; value: string }> = ({ filterKey, value }) => {
  switch (value) {
    case "Logement":
      return <LogementSVG className="icon" title="Logement" />;
    case "Équipement":
      return <EquipementSVG className="icon" title="Équipement" />;
    case "Espace public":
      return <EspacePublicSVG className="icon" title="Espace public" />;
    default:
      return null;
  }
};

export default FilterValueIcons;
