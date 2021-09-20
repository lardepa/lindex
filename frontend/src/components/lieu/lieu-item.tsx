import React from "react";
import { LieuType } from "../../types";
import LogoSVG from "../assets/logo.svg";
import { LinkPreview } from "../link-preview";
import { DestinationSVG } from "../map/marker-icon";

export const LieuItem: React.FC<{ lieu: LieuType; className?: string }> = ({ lieu, className }) => (
  <LinkPreview
    to={`/lieu/${lieu.id}`}
    className={`menu-item selected d-flex align-items-center ${className}`}
    key={lieu.id}
  >
    <img src={DestinationSVG(lieu.type.type_destination)} alt={lieu.type.type_destination} className="h-50" />
    <div className="d-flex flex-column mx-3">
      <div>
        <b>{lieu.nom}</b>,{" "}
        {lieu.type.destination && (
          <span className="metadata" style={{ fontWeight: "normal" }}>
            {lieu.type.destination}
          </span>
        )}
      </div>
      <div>{lieu.adresse}</div>
    </div>
  </LinkPreview>
);