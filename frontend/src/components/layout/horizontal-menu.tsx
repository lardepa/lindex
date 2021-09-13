import React from "react";
import { LinkPreview } from "../link-preview";

export const HorizontalMenu: React.FC<{ selected?: "selections" | "parcours" | "explorer" }> = ({ selected }) => {
  return (
    <div className="horizontal-menu">
      <LinkPreview className={selected === "selections" ? "selections" : ""} to={`/selections`}>
        Les sélections de nos invités
      </LinkPreview>

      <LinkPreview className={selected === "explorer" ? "explorer" : ""} to="/explorer">
        Explorer la carte
      </LinkPreview>

      <LinkPreview className={selected === "parcours" ? "parcours" : ""} to="/parcours">
        Les parcours de l'Ardepa
      </LinkPreview>
    </div>
  );
};
