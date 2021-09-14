import React from "react";
import { LinkPreview } from "../link-preview";

export const HorizontalMenu: React.FC<{ selected?: "selections" | "parcours" | "explorer" }> = ({ selected }) => {
  return (
    <div className="horizontal-menu">
      <LinkPreview
        className={selected === "selections" ? "selections" : ""}
        to={`/selections`}
        style={{ gridColumn: 1 }}
      >
        Les sélections de nos invités
      </LinkPreview>

      <LinkPreview className={selected === "explorer" ? "explorer" : ""} to="/explorer" style={{ gridColumn: 2 }}>
        Explorer la carte
      </LinkPreview>

      <LinkPreview className={selected === "parcours" ? "parcours" : ""} to="/parcours" style={{ gridColumn: 3 }}>
        Les parcours de l'Ardepa
      </LinkPreview>
    </div>
  );
};
