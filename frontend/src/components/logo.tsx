import React from "react";
import LogoPNG from "../assets/logo_lindex.png";
import { LinkPreview } from "./link-preview";

export const Logo: React.FC<{}> = () => (
  <LinkPreview to="/" className="logo">
    <img src={LogoPNG} alt="L'ardepa Carto" />
  </LinkPreview>
);
