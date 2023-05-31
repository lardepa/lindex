import React from "react";
import { useQueryParamsState } from "../../hooks/queryParams";
import { LieuType } from "../../types";
import { LinkPreview } from "../link-preview";

export const LieuRelatedItems: React.FC<{ lieu: LieuType }> = ({ lieu }) => {
  const [{ isPreview }] = useQueryParamsState();

  return (
    <div className="vertical-menu">
      {lieu.parcours &&
        lieu.parcours
          .filter((p) => isPreview || p.status === "Publié")
          .map((p) => (
            <LinkPreview key={p.id} to={`/parcours/${p.id}`} className="parcours menu-item selected related">
              Mentionné dans le parcours "{p["sous-titre"]}"
            </LinkPreview>
          ))}
      {lieu.sélections &&
        lieu.sélections
          .filter((s) => isPreview || s.status === "Publié")
          .map((s) => (
            <LinkPreview key={s.id} to={`/selections/${s.id}`} className="selections menu-item selected related">
              Sélectionné par {s.invité}
            </LinkPreview>
          ))}
    </div>
  );
};
