import React from "react";
import ReactMarkdown from "react-markdown";
import { LieuType } from "../../types";
import { Media } from "../media/media";

const MetadataField: React.FC<{ label: string; value: string | string[] }> = ({ label, value }) => {
  const values: string[] = Array.isArray(value) ? value : [value];
  return (
    <div className="field">
      <span className="label">{label}</span>
      {values?.map((v) => (
        <span className="value">{v}</span>
      ))}
    </div>
  );
};

export const Lieu: React.FC<{ lieu: LieuType }> = ({ lieu }) => (
  <>
    {/* first 1/3 column */}
    <div style={{ gridArea: "col-content" }} className="d-flex flex-column justify-content-between">
      <div
        // className="flex-shrink-1 flex-grow-1 flex-basis-1"
        style={{
          padding: "2rem 1rem 3rem 1rem",
          overflowY: "auto",
          lineHeight: "1.5rem",
          fontSize: "1.125em",
          flexGrow: 1,
          height: "1px",
        }}
      >
        <h1>{lieu.nom}</h1>
        <div className="long-text">
          <ReactMarkdown>{lieu.présentation}</ReactMarkdown>
        </div>
      </div>

      <div className="metadata metadata-panel flex-shrink-0">
        {lieu.maitre_oeuvre && <MetadataField label="Maître d'œuvre" value={lieu.maitre_oeuvre.map((m) => m.nom)} />}
        {lieu.date && <MetadataField label="Date" value={lieu.date} />}
        {lieu.type && <MetadataField label="Typologie" value={lieu.type.destination} />}

        {lieu.distinctions && (
          <>
            {lieu.distinctions.map((d, i) => (
              <MetadataField key={i} label="Récompense" value={d.nom} />
            ))}
          </>
        )}
      </div>
    </div>
    {/* seccond 2/3 column */}
    <div
      className="media-container"
      style={{ gridArea: "main-content", overflowY: "auto", overflowX: "hidden", paddingTop: "1rem" }}
    >
      {lieu?.cover_media && <Media media={lieu?.cover_media} />}
      {lieu?.médias?.map((m) => (
        <Media key={m.id} media={m} />
      ))}
    </div>
  </>
);
