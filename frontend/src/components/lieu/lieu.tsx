import { uniq } from "lodash";
import React from "react";
import ReactMarkdown from "react-markdown";
import config from "../../config";
import { LieuType } from "../../types";
import { LinkPreview } from "../link-preview";
import { Media } from "../media/media";

export const MetadataField: React.FC<{ label: string; filterKey: string; value: string | string[]; noLink?: Boolean }> =
  ({ label, value, filterKey, noLink }) => {
    const values: string[] = Array.isArray(value) ? value : [value];
    return (
      <div className={`${filterKey !== "moeuvre" ? "extra-metadata" : "main-metadata"} field`}>
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
              <span className="value-no-link">{v}</span>
            )}
          </>
        ))}
      </div>
    );
  };

export const Lieu: React.FC<{ lieu: LieuType; width?: number }> = ({ lieu, width }) => {
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.md;
  return (
    <>
      {/* first 1/3 column */}
      <div
        style={{ gridArea: "col-content", marginTop: "0.6rem" }}
        className={`d-flex flex-column justify-content-between`}
      >
        <div
          // className="flex-shrink-1 flex-grow-1 flex-basis-1"
          style={{
            padding: "0.5rem 1rem",
            overflowY: smallScreen ? "unset" : "auto",
            lineHeight: "1.5rem",
            fontSize: "1.125em",
            flexGrow: 1,
            height: smallScreen ? "auto" : "1px",
          }}
        >
          <h1 className="mb-3">{lieu.nom}</h1>
          {/* MEDIA COVER when small screen */}
          {smallScreen && lieu?.cover_media && (
            <div className="media-container">
              {" "}
              <Media media={lieu?.cover_media} cover />{" "}
            </div>
          )}
          <div className="long-text" style={{ lineHeight: "1.45rem", fontSize: "1em" }}>
            <ReactMarkdown>{lieu.pr??sentation}</ReactMarkdown>
          </div>
        </div>

        {/*  MEDIAS in this olumn on small screen */}
        {smallScreen && (
          <div className="media-container">
            {lieu?.m??dias?.map((m) => (
              <Media key={m.id} media={m} />
            ))}
          </div>
        )}
        <div className=" metadata-panel flex-shrink-0">
          {lieu.maitre_oeuvre && (
            <MetadataField filterKey="moeuvre" label="Ma??tre d'??uvre" value={lieu.maitre_oeuvre.map((m) => m.nom)} />
          )}
          {lieu.maitre_ouvrage && (
            <MetadataField
              filterKey="mouvrage"
              label="Ma??tre d'ouvrage"
              value={lieu.maitre_ouvrage.map((m) => m.nom)}
            />
          )}
          {lieu.date && <MetadataField filterKey="date" label="Date" value={lieu.date} noLink />}
          {lieu.type && (
            <>
              <MetadataField
                filterKey="type"
                label="Typologie"
                value={uniq(lieu.type.map((t) => t.type_destination))}
              />
              <MetadataField filterKey="prog" label="Programme" value={uniq(lieu.type.map((t) => t.destination))} />
            </>
          )}

          {lieu.distinctions && (
            <>
              {lieu.distinctions.map((d, i) => (
                <MetadataField filterKey="dist" key={i} label="R??compense" value={d.nom} />
              ))}
            </>
          )}
        </div>
      </div>
      {/* seccond 2/3 column */}
      <div className="media-container" style={{ gridArea: "main-content", overflowY: "auto", overflowX: "hidden" }}>
        {lieu?.cover_media && <Media media={lieu?.cover_media} />}
        {lieu?.m??dias?.map((m) => (
          <Media key={m.id} media={m} />
        ))}
      </div>
    </>
  );
};
