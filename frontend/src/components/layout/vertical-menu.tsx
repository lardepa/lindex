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

    <LinkPreview to="/a-propos" className="about-item menu-item parcours selected">
      Qui sommes nous ?
    </LinkPreview>

    <LinkPreview to="/mentions-legales" className="about-item menu-item parcours selected">
      Mentions légales
    </LinkPreview>
  </div>
);
