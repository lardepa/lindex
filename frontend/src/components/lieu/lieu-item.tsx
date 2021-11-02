import React from "react";
import { LieuType } from "../../types";
import { LinkPreview } from "../link-preview";
import { DestinationSVG } from "../map/marker-icon";

export const LieuItem: React.FC<{ lieu: LieuType; className?: string }> = ({ lieu, className }) => (
  <LinkPreview
    to={`/lieux/${lieu.id}`}
    className={`menu-item selected d-flex align-items-center ${className}`}
    key={lieu.id}
    style={{ padding: 0 }}
  >
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ width: "3rem", height: "100%", backgroundColor: "white", flexShrink: 0 }}
    >
      <img
        src={DestinationSVG(lieu.type[0]?.type_destination)}
        alt={lieu.type[0]?.type_destination || "??"}
        style={{ width: "1.8rem" }}
      />
    </div>
    <div className="d-flex flex-column" style={{ fontSize: "0.875rem", lineHeight: "1rem", padding: "0.4rem 1rem" }}>
      <div>
        <b>{lieu.nom}</b>,{" "}
        {lieu.type[0]?.destination && (
          <span className="metadata" style={{ fontWeight: 700 }}>
            {lieu.type[0]?.destination}
          </span>
        )}
      </div>
      <div style={{ fontWeight: "lighter" }}>{lieu.adresse}</div>
    </div>
  </LinkPreview>
);
