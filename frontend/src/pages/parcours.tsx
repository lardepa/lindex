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
import { pick } from "lodash";

const _ParcoursPage: React.FC<{ width: number }> = ({ width }) => {
  const { id } = useParams<{ id: string }>();
  const [parcours, loading] = useGetOne<ParcoursType | null>("parcours", id);
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.md;

  const map = (
    <>
      {!loading && parcours && (
        <div className="d-flex flex-column flex-grow-1 justify-content-end">
          <div className="map-aside d-flex flex-column">
            <div className="rightHeader">{parcours["sous-titre"]}</div>
            {parcours.lieux && (
              <Map
                lieux={parcours.lieux}
                className="map-in-menu"
                itinaries={{ [parcours.id]: parcours.lieux.map((l) => pick(l, ["id", "geolocalisation"])) }}
                disableScroll={!!smallScreen}
              />
            )}
          </div>
          <div className="steps vertical-menu">
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
              <div className="flex-grow-1" style={{ gridArea: "col-content" }}>
                {parcours.cover_media && (
                  <div className="w-100 media-container">
                    <Media media={parcours.cover_media} />
                  </div>
                )}
                <h1 className="mb-3 px-3" style={{ fontWeight: 700 }}>
                  {parcours.nom}
                </h1>
                <h5 className="metadata mb-2 px-3" style={{ fontWeight: 500 }}>
                  {parcours["sous-titre"]}
                </h5>
                {parcours.date && (
                  <h5 className="metadata px-3">{Intl.DateTimeFormat("FR-fr").format(new Date(parcours.date))}</h5>
                )}
              </div>
              <div className="flex-grow-2 edito" style={{ gridArea: "main-content" }}>
                <ReactMarkdown>{parcours.édito}</ReactMarkdown>
              </div>
              <div
                className={`${smallScreen ? "media-container" : "horizontal-carousel"} parcours-gallery `}
                style={{ gridArea: smallScreen ? "media" : "footer" }}
              >
                {parcours?.médias?.map((m) => (
                  <Media key={m.id} media={m} forceRatio="force-height" cover />
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
