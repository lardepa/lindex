import React from "react";
import { ParcoursType } from "../types";
import { useParams } from "react-router-dom";
import { Media } from "../components/media/media";
import { Map } from "../components/map/map";
import { PageLayout } from "../components/layout/page-layout";
import ReactMarkdown from "react-markdown";
import { LinkPreview } from "../components/link-preview";
import { useGetOne } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import { LieuItem } from "../components/lieu/lieu-item";
import withSize from "../components/layout/with-size";
import config from "../config";

const _ParcoursPage: React.FC<{ width: number }> = ({ width }) => {
  const { id } = useParams<{ id: string }>();
  const [parcours, loading] = useGetOne<ParcoursType | null>("parcours", id);
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.sm;

  const map = (
    <>
      {!loading && parcours && (
        <div className="d-flex flex-column flex-grow-1 justify-content-end">
          <div className="map-aside">
            <div className="rightHeader">{parcours["sous-titre"]}</div>
            {parcours.lieux && (
              <Map lieux={parcours.lieux} className="half-height" itinary={true} disableScroll={!!smallScreen} />
            )}
          </div>
          <div className="steps parcours vertical-menu">
            {parcours.lieux.map((l, stepIndex) => (
              <LieuItem lieu={l} className="parcours" />
            ))}
            <LinkPreview className="menu-item" to="/parcours">
              Voir les autres parcours
            </LinkPreview>
          </div>
        </div>
      )}
    </>
  );

  return (
    <PageLayout
      gridLayoutName="parcours-grid-area"
      menuSelectedItem="parcours"
      leftContent={smallScreen ? null : map}
      rightContent={
        <>
          {!loading && parcours && (
            <>
              <div className="flex-grow-1 metadata" style={{ gridArea: "col-content" }}>
                {parcours.cover_media && (
                  <div className="w-100 media-container">
                    <Media media={parcours.cover_media} />
                  </div>
                )}
                <h1>{parcours.nom}</h1>
                <h4>{parcours["sous-titre"]}</h4>
                {parcours.date && <h3>{Intl.DateTimeFormat("FR-fr").format(new Date(parcours.date))}</h3>}
              </div>
              <div className="flex-grow-2 edito" style={{ gridArea: "main-content" }}>
                <ReactMarkdown>{parcours.édito}</ReactMarkdown>
              </div>
              <div
                className={`${smallScreen ? "media-container" : ""} parcours-gallery`}
                style={{ gridArea: smallScreen ? "media" : "footer" }}
              >
                {parcours?.médias?.map((m) => (
                  <Media key={m.id} media={m} />
                ))}
              </div>
              {smallScreen && <div style={{ gridArea: "map" }}>{map}</div>}
            </>
          )}
          <Loader loading={loading} />
        </>
      }
    />
  );
};

export const ParcoursPage = withSize<{}>(_ParcoursPage);
