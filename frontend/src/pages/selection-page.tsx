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

export const SelectionPage: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [selection, loading] = useGetOne<SelectionType>("selections", id);
  return (
    <PageLayout
      menuSelectedItem="selections"
      gridLayoutName="colonne-main-footer-area "
      leftContent={
        <>
          <>
            {!loading && selection && (
              <div className="d-flex flex-column flex-grow-1">
                <div className="rightHeader">Sélection de {selection.invité}</div>
                {selection.lieux && <Map lieux={selection.lieux} className="half-height" />}
                <div className="steps flex-grow-1 vertical-menu selections">
                  {selection.lieux.map((l, stepIndex) => (
                    // todo: change link to state in params
                    <LieuItem lieu={l} className="selections" />
                  ))}
                </div>
                <LinkPreview className="menu-item" to="/sélections">
                  Voir les autres sélections
                </LinkPreview>
              </div>
            )}
          </>
        </>
      }
      rightContent={
        <>
          {!loading && selection && (
            <>
              <div style={{ gridArea: "col-content" }}>
                {selection?.portrait && (
                  <div className="w-100 media-container pt-3">
                    <Media media={selection?.portrait} />
                  </div>
                )}
                <div className="metadata p-3">
                  <h1>{selection.invité}</h1>
                </div>
              </div>
              <div className="long-text p-3" style={{ gridArea: "main-content" }}>
                <ReactMarkdown>{selection?.édito}</ReactMarkdown>
              </div>
              <div className="horizontal-carousel" style={{ gridArea: "footer" }}>
                {selection.lieux.map(
                  (l) =>
                    (l.cover_media || l.médias?.[0]) && (
                      <LinkPreview to={`/lieux/${l.id}`} className="lieu-card">
                        <span className="title">
                          <img src={DestinationSVG(l.type.type_destination)} alt={l.type.type_destination} />
                          {l.nom}
                        </span>
                        <Media media={l.cover_media || (l.médias?.[0] as MediaType)} forceRatio="force-height" cover />
                      </LinkPreview>
                    ),
                )}
              </div>
            </>
          )}
        </>
      }
    />
  );
};
