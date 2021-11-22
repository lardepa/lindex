import React from "react";
import { MediaType, SelectionType } from "../types";
import { useParams } from "react-router-dom";
import { Media } from "../components/media/media";
import { useGetOne } from "../hooks/useAPI";
import { PageLayout } from "../components/layout/page-layout";
import ReactMarkdown from "react-markdown";
import { Map } from "../components/map/map";
import { LieuItem } from "../components/lieu/lieu-item";
import { LinkPreview } from "../components/link-preview";
import { DestinationSVG } from "../components/map/marker-icon";
import config from "../config";
import withSize from "../components/layout/with-size";

export const _SelectionPage: React.FC<{ width: number }> = ({ width }) => {
  const { id } = useParams<{ id: string }>();
  const [selection, loading] = useGetOne<SelectionType>("selections", id);

  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.sm;

  const map = (
    <>
      {!loading && selection && (
        <div className="d-flex flex-column flex-grow-1 justify-content-end">
          <div className="map-aside d-flex flex-column">
            <div className="rightHeader">Sélection de {selection.invité}</div>
            {selection.lieux && <Map lieux={selection.lieux} className="map-in-menu" disableScroll={!!smallScreen} />}
          </div>
          <div className="steps vertical-menu selections">
            {selection.lieux.map((l, stepIndex) => (
              // todo: change link to state in params
              <LieuItem lieu={l} className="selections" />
            ))}
            <LinkPreview className="menu-item related" to="/sélections">
              Voir les autres sélections
            </LinkPreview>
          </div>
        </div>
      )}
    </>
  );

  return (
    <PageLayout
      menuSelectedItem="selections"
      gridLayoutName="colonne-main-footer-area "
      leftContent={map}
      rightContent={
        <>
          {!loading && selection && (
            <>
              <div style={{ gridArea: "col-content" }}>
                {selection?.portrait && (
                  <div className="w-100 media-container">
                    <Media media={selection?.portrait} />
                  </div>
                )}
                <div className="p-3 pt-2">
                  <h1>{selection.invité}</h1>

                  <ReactMarkdown className="metadata">{selection?.introduction}</ReactMarkdown>
                </div>
              </div>
              <div className="long-text px-3" style={{ gridArea: "main-content", marginTop: "0.6rem" }}>
                <ReactMarkdown>{selection?.édito}</ReactMarkdown>
              </div>
              <div className="horizontal-carousel" style={{ gridArea: "footer" }}>
                {selection.lieux.map(
                  (l) =>
                    (l.cover_media || l.médias?.[0]) && (
                      <LinkPreview to={`/lieux/${l.id}`} className="lieu-card">
                        <span className="title">
                          <img src={DestinationSVG(l.type[0]?.type_destination)} alt={l.type[0]?.type_destination} />
                          {l.nom}
                        </span>
                        <Media media={l.cover_media || (l.médias?.[0] as MediaType)} forceRatio="force-height" cover />
                      </LinkPreview>
                    ),
                )}
              </div>
              {smallScreen && <div style={{ gridArea: "map" }}>{map}</div>}
            </>
          )}
        </>
      }
    />
  );
};

export const SelectionPage = withSize<{}>(_SelectionPage);
