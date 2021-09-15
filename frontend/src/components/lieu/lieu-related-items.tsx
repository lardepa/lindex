import React from "react";
import { Link } from "react-router-dom";
import { useQueryParamsState } from "../../hooks/queryParams";
import { LieuType } from "../../types";

export const LieuRelatedItems: React.FC<{ lieu: LieuType }> = ({ lieu }) => {
  const [{ isPreview }] = useQueryParamsState();

  return (
    <div className="vertical-menu">
      {lieu.parcours &&
        lieu.parcours
          .filter((p) => isPreview || p.status === "Publié")
          .map((p) => (
            <Link to={`/parcours/${p.id}`} className="parcours menu-item selected">
              Mentionné dans le parcours "{p["sous-titre"]}"
            </Link>
          ))}
      {lieu.sélections &&
        lieu.sélections
          .filter((s) => isPreview || s.status === "Publié")
          .map((s) => (
            <Link to={`/selections/${s.id}`} className="selections menu-item selected">
              Sélectionné par {s.invité}
            </Link>
          ))}
    </div>
  );
};
