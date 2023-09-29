import React from "react";
import LogoSVG from "../assets/Logo-Lindex.svg";
import { LinkPreview } from "./link-preview";

export const Logo: React.FC<{}> = () => (
  <LinkPreview to="/" className="logo">
    <img src={LogoSVG} alt="L'index" />
  </LinkPreview>
);
