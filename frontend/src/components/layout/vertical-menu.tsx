import React from "react";
import { Link } from "react-router-dom";

export const VerticalMenu: React.FC<{}> = () => (
  <div className="vertical-menu">
    <div className="selections">
      <Link to="/selections">Les sélections de nos invités</Link>
    </div>
    <div className="explorer">
      <Link to="/explorer">Explorer la carte</Link>
    </div>
    <div className="parcours">
      <Link to="/parcours">Les parcours de l'Ardepa</Link>
    </div>
    <div className="about-item">
      <Link to="/a-propos">Qui sommes nous ?</Link>
    </div>
    <div className="about-item">
      <Link to="/mentions-legales">Mentions légales</Link>
    </div>
  </div>
);
