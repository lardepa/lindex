import React from "react";
import { LinkPreview } from "../link-preview";

export const VerticalMenu: React.FC<{}> = () => (
  <div className="vertical-menu nav-home">
    <LinkPreview className="selections selected menu-item" to="/selections">
      Les sélections de nos invités
    </LinkPreview>

    <LinkPreview to="/explorer" className="explorer selected menu-item">
      Explorer la carte
    </LinkPreview>

    <LinkPreview to="/parcours" className="parcours selected menu-item">
      Les parcours de l'Ardepa
    </LinkPreview>

    <LinkPreview to="/a-propos" className="about-item menu-item">
      Qui sommes nous ?
    </LinkPreview>

    <LinkPreview className="about-item menu-item" to="/mentions-legales">
      Mentions légales
    </LinkPreview>
  </div>
);
