import React from "react";
import ReactMarkdown from "react-markdown";
import { LieuType } from "../types";
import { Media } from "./media";

export const Lieu: React.FC<{ lieu: LieuType }> = ({ lieu }) => (
  <>
    {/* first 1/3 column */}
    <div className="d-flex flex-column justify-content-start " style={{ gridArea: "col-content" }}>
      <h1>{lieu.nom}</h1>
      <div>
        <ReactMarkdown>{lieu.présentation}</ReactMarkdown>
      </div>
      <div>
        <div> TODO: metadata</div>
      </div>
    </div>
    {/* seccond 2/3 column */}
    <div style={{ gridArea: "main-content" }}>
      {lieu?.cover_media && <Media media={lieu?.cover_media} />}
      {lieu?.médias?.map((m) => (
        <Media key={m.id} media={m} />
      ))}
    </div>
  </>
);
