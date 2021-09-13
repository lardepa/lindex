import React from "react";
import { LinkPreview } from "../link-preview";

export const VerticalMenu: React.FC<{}> = () => (
  <div className="vertical-menu">
    <div className="selections">
      <LinkPreview to="/selections">Les sélections de nos invités</LinkPreview>
    </div>
    <div className="explorer">
      <LinkPreview to="/explorer">Explorer la carte</LinkPreview>
    </div>
    <div className="parcours">
      <LinkPreview to="/parcours">Les parcours de l'Ardepa</LinkPreview>
    </div>
    <div className="about-item">
      <LinkPreview to="/a-propos">Qui sommes nous ?</LinkPreview>
    </div>
    <div className="about-item">
      <LinkPreview to="/mentions-legales">Mentions légales</LinkPreview>
    </div>
  </div>
);
