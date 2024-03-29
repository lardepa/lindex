import { identity, uniq } from "lodash";
import React, { Fragment, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import config from "../../config";
import { LieuType } from "../../types";
import { LinkPreview } from "../link-preview";
import { NavigateTo } from "../map/NavigateTo";
import { MediaGallery } from "../media/gallery";
import { Media } from "../media/media";

export const MetadataField: React.FC<{
  label: string;
  filterKey: string;
  value: string | string[];
  noLink?: Boolean;
  children?: ReactNode;
}> = ({ label, value, filterKey, noLink, children }) => {
  const values: string[] = Array.isArray(value) ? value : [value];
  return (
    <div className={`${filterKey !== "moeuvre" ? "extra-metadata" : "main-metadata"} field`}>
      <span className="label">{label}</span>
      {values?.map((v, i) => (
        <Fragment key={i}>
          {!noLink ? (
            <LinkPreview
              title={v}
              to={`/explorer?${encodeURIComponent(filterKey)}=${encodeURIComponent(v)}`}
              className="value"
            >
              {v}
            </LinkPreview>
          ) : (
            <span className="value-no-link" title={v}>
              {v}
            </span>
          )}
        </Fragment>
      ))}
      {children}
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
        className={`d-flex flex-column justify-content-start`}
      >
        <div
          className="px-3"
          style={{
            padding: "0.5rem 0",
            overflowY: smallScreen ? "unset" : "auto",
            lineHeight: "1.5rem",
            fontSize: "1.125em",
            flexGrow: 1,
            //height: smallScreen ? "auto" : "1px",
          }}
        >
          <h1 className="mb-3">{lieu.nom}</h1>
          {/* MEDIA COVER when small screen */}
          {smallScreen && lieu?.cover_media && (
            <div className="media-container">
              {" "}
              <Media media={lieu?.cover_media} cover sizes="100vw" />{" "}
            </div>
          )}
        </div>
        <div className=" metadata-panel">
          {lieu.maitre_oeuvre && (
            <MetadataField filterKey="moeuvre" label="Maître d'œuvre" value={lieu.maitre_oeuvre.map((m) => m.nom)} />
          )}
          {lieu.maitre_ouvrage && (
            <MetadataField
              filterKey="mouvrage"
              label="Maître d'ouvrage"
              value={lieu.maitre_ouvrage.map((m) => m.nom)}
            />
          )}
          {lieu.date && <MetadataField filterKey="date" label="Date" value={lieu.date} noLink />}
          {lieu.type && (
            <>
              <MetadataField
                filterKey="type"
                label="Typologie"
                value={uniq(lieu.type.map((t) => t.type_destination)).filter(identity)}
                noLink
              />
              <MetadataField
                filterKey="programme"
                label="Programme"
                value={uniq(lieu.type.map((t) => t.destination))}
              />
            </>
          )}

          {lieu.distinctions && (
            <MetadataField filterKey="dist" label="Distinction" value={lieu.distinctions.map((d) => d.nom)} />
          )}

          {lieu.adresse && (
            <MetadataField filterKey="adresse" label="Adresse" value={lieu.adresse} noLink>
              <NavigateTo lieu={lieu} className="ps-2 align-self-start" />
            </MetadataField>
          )}
        </div>
        <div className="long-text px-3">
          <ReactMarkdown>{lieu.présentation}</ReactMarkdown>
        </div>
        {/*  MEDIAS in this column on small screen */}
        {smallScreen && (
          <div className="media-container">
            <MediaGallery
              medias={(lieu?.cover_media ? [lieu.cover_media] : []).concat(lieu?.médias || [])}
              sizes="100vw"
            />
          </div>
        )}
      </div>

      {/* second 2/3 column */}
      <div className="media-container" style={{ gridArea: "main-content", overflowY: "auto", overflowX: "hidden" }}>
        <MediaGallery medias={(lieu?.cover_media ? [lieu.cover_media] : []).concat(lieu?.médias || [])} sizes="50vw" />
      </div>
    </>
  );
};
