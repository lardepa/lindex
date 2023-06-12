import React from "react";
import { LinkPreview } from "../link-preview";

export const VerticalMenu: React.FC<{}> = () => (
  <div className="vertical-menu nav-home">
    <LinkPreview className="selections selected menu-item" to="/selections">
      Sélections des invités
    </LinkPreview>

    <LinkPreview to="/explorer" className="explorer selected menu-item">
      Explorer la carte
    </LinkPreview>

    <LinkPreview to="/parcours" className="parcours selected menu-item">
      Parcours
    </LinkPreview>

    <LinkPreview to="/a-propos" className=" menu-item parcours selected">
      À propos
    </LinkPreview>

    <LinkPreview to="/glossaire" className=" menu-item parcours selected">
      Glossaire
    </LinkPreview>
  </div>
);
