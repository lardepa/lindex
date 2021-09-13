import React from "react";
import LogoSVG from "../assets/logo.svg";
import { LinkPreview } from "./link-preview";

export const Logo: React.FC<{}> = () => (
  <LinkPreview to="/" className="logo">
    <img src={LogoSVG} alt="L'ardepa Carto" />
  </LinkPreview>
);
