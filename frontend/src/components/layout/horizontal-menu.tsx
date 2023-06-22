import React from "react";
import { LinkPreview } from "../link-preview";

export const HorizontalMenu: React.FC<{ selected?: "selections" | "parcours" | "explorer" }> = ({ selected }) => {
  return (
    <div className="horizontal-menu">
      <LinkPreview
        className={`menu-item selections ${selected === "selections" ? "selected" : ""}`}
        to={`/selections`}
        style={{ gridColumn: 1 }}
      >
        Sélections des invités
      </LinkPreview>

      <LinkPreview
        className={`menu-item explorer ${selected === "explorer" ? "selected" : ""}`}
        to="/explorer"
        style={{ gridColumn: 2 }}
      >
        Explorer la carte
      </LinkPreview>

      <LinkPreview
        className={`menu-item parcours ${selected === "parcours" ? "selected" : ""}`}
        to="/parcours"
        style={{ gridColumn: 3 }}
      >
        Parcours
      </LinkPreview>
    </div>
  );
};
