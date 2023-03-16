import React from "react";

import { ReactComponent as LogementSVG } from "../../assets/logement.svg";
import { ReactComponent as EquipementSVG } from "../../assets/equipement.svg";
import { ReactComponent as EspacePublicSVG } from "../../assets/espace_public.svg";

const FilterValueIcons: React.FC<{ filterKey: string; value: string }> = ({ filterKey, value }) => {
  if (filterKey !== "type") return null;
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
