import React from "react";
import ReactMarkdown from "react-markdown";
import { LieuType } from "../../types";
import { LinkPreview } from "../link-preview";
import { Media } from "../media/media";

export const MetadataField: React.FC<{ label: string; filterKey: string; value: string | string[]; noLink?: Boolean }> =
  ({ label, value, filterKey, noLink }) => {
    const values: string[] = Array.isArray(value) ? value : [value];
    return (
      <div className="field">
        <span className="label">{label}</span>
        {values?.map((v, i) => (
          <>
            {!noLink ? (
              <LinkPreview
                key={i}
                to={`/explorer?${encodeURIComponent(filterKey)}=${encodeURIComponent(v)}`}
                className="value"
              >
                {v}
              </LinkPreview>
            ) : (
              <span>{v}</span>
            )}
          </>
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

      <div className=" metadata-panel flex-shrink-0">
        {lieu.maitre_oeuvre && (
          <MetadataField filterKey="moeuvre" label="Maître d'œuvre" value={lieu.maitre_oeuvre.map((m) => m.nom)} />
        )}
        {lieu.date && <MetadataField filterKey="date" label="Date" value={lieu.date} noLink />}
        {lieu.type && (
          <MetadataField filterKey="type" label="Typologie" value={lieu.type.map((t) => t.type_destination)} />
        )}

        {lieu.distinctions && (
          <>
            {lieu.distinctions.map((d, i) => (
              <MetadataField filterKey="dist" key={i} label="Récompense" value={d.nom} />
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
