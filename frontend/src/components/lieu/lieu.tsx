import React from "react";
import ReactMarkdown from "react-markdown";
import { LieuType } from "../../types";
import { Media } from "../media";

const MetadataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="field">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

export const Lieu: React.FC<{ lieu: LieuType }> = ({ lieu }) => (
  <>
    {/* first 1/3 column */}
    <div className="d-flex flex-column justify-content-start " style={{ gridArea: "col-content" }}>
      <h1>{lieu.nom}</h1>
      <div>
        <ReactMarkdown>{lieu.présentation}</ReactMarkdown>
      </div>

      <div className="metadata metadata-panel">
        {lieu.maitre_oeuvre && lieu.maitre_oeuvre.nom && (
          <MetadataField label="Maître d'œuvre" value={lieu.maitre_oeuvre.nom} />
        )}
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
    <div style={{ gridArea: "main-content" }}>
      {lieu?.cover_media && <Media media={lieu?.cover_media} />}
      {lieu?.médias?.map((m) => (
        <Media key={m.id} media={m} />
      ))}
    </div>
  </>
);
