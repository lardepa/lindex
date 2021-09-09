import React from "react";
import { Link } from "react-router-dom";
import LogoSVG from "../assets/logo.svg";

export const Logo: React.FC<{}> = () => (
  <Link to="/" className="logo">
    <img src={LogoSVG} alt="L'ardepa Carto" />
  </Link>
);
