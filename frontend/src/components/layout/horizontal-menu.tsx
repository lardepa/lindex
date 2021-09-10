import React from "react";
import { Link } from "react-router-dom";
import { useQueryParamsState } from "../../hooks/queryParams";

export const HorizontalMenu: React.FC<{ selected?: "selections" | "parcours" | "explorer" }> = ({ selected }) => {
  const [{ isPreview }] = useQueryParamsState();
  const search = isPreview ? "preview" : "";
  return (
    <div className="horizontal-menu">
      <div className={selected === "selections" ? "selections" : ""}>
        <Link to={`/selections?${search}`}>Les sélections de nos invités</Link>
      </div>
      <div className={selected === "explorer" ? "explorer" : ""}>
        <Link to="/explorer">Explorer la carte</Link>
      </div>
      <div className={selected === "parcours" ? "parcours" : ""}>
        <Link to="/parcours">Les parcours de l'Ardepa</Link>
      </div>
    </div>
  );
};
