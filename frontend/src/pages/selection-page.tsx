import React, { FC, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import Embed from "react-tiny-oembed";
import { PageLayout } from "../components/layout/page-layout";
import withSize from "../components/layout/with-size";
import { LieuItem } from "../components/lieu/lieu-item";
import { LinkPreview } from "../components/link-preview";
import { Map } from "../components/map/map";
import { DestinationSVG } from "../components/map/marker-icon";
import { Media } from "../components/media/media";
import config from "../config";
import { useQueryParamsState } from "../hooks/queryParams";
import { useGetLasyData, useGetOne } from "../hooks/useAPI";
import { MediaType, SelectionType } from "../types";

export const SelectionMapMenu: FC<{
  selectionId: string;
  selection?: SelectionType;
  loading?: boolean;
  smallScreen?: boolean;
}> = ({ selectionId, selection: alreadyLoadedSelection, loading, smallScreen }) => {
  const [{ isPreview }] = useQueryParamsState();
  const { getData: getSelection, loading: loadingSelection } = useGetLasyData<SelectionType>("selections", selectionId);
  const [selection, setSelection] = useState<SelectionType | undefined>(alreadyLoadedSelection);
  useEffect(() => {
    if (selectionId && alreadyLoadedSelection === undefined) {
      getSelection().then((data) => {
        if (data) {
          setSelection(data);
        }
      });
    }
  }, [selectionId, alreadyLoadedSelection, setSelection, getSelection]);

  return (
    <>
      {!loading && !loadingSelection && selection && (
        <div className="d-flex flex-column flex-grow-1 justify-content-end">
          <div className="map-aside d-flex flex-column">
            <LinkPreview to={`/selections/${selectionId}`}>
              <div className="rightHeader">Sélection de {selection.invité}</div>
            </LinkPreview>
            {selection.lieux && (
              <Map
                lieux={selection.lieux.filter((l) => isPreview || l.status === "Publié")}
                className="map-in-menu"
                disableScroll={smallScreen}
              />
            )}
          </div>
          <div className="steps vertical-menu selections">
            {selection.lieux
              .filter((l) => isPreview || l.status === "Publié")
              .map((l, stepIndex) => (
                // todo: change link to state in params
                <LieuItem key={stepIndex} lieu={l} className="selections" selectionId={selectionId} />
              ))}
            <LinkPreview className="menu-item related see-also" to="/selections">
              Voir les autres sélections
            </LinkPreview>
          </div>
        </div>
      )}
    </>
  );
};

export const _SelectionPage: React.FC<{ width: number }> = ({ width }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [{ isPreview }] = useQueryParamsState();
  if (!id) {
    navigate("/selections");
    return null;
  }
  const [selection, loading] = useGetOne<SelectionType>("selections", id);

  const smallScreen = width <= config.RESPONSIVE_BREAKPOINTS.md;

  return (
    <PageLayout
      menuSelectedItem="selections"
      gridLayoutName="colonne-main-footer-area "
      leftContent={
        selection && <SelectionMapMenu selectionId={selection.id} selection={selection} smallScreen={smallScreen} />
      }
      rightContent={
        <>
          {!loading && selection && (
            <>
              <div style={{ gridArea: "col-content" }}>
                {selection?.portrait && (
                  <div className="w-100 media-container">
                    <Media media={selection?.portrait} sizes="(max-width:576px) 100vw, (max-width:960px) 80vw, 25vw" />
                  </div>
                )}
                <div className="p-3 pt-2">
                  <h1>{selection.invité}</h1>
                  <h2 className="metadata fs-5" style={{ fontWeight: 500 }}>
                    {selection["sous-titre"]}
                  </h2>
                  <ReactMarkdown className="fw-medium">{selection?.introduction}</ReactMarkdown>
                </div>
              </div>
              <div className="long-text edito" style={{ gridArea: "main-content", marginTop: "0.6rem" }}>
                {selection.soundcloud && (
                  <Embed options={{ maxheight: 100 }} url={selection.soundcloud} style={{ marginBottom: "1.6rem" }} />
                )}
                <ReactMarkdown>{selection?.édito}</ReactMarkdown>
              </div>
              <div className="horizontal-carousel selection-medias" style={{ gridArea: "footer" }}>
                {selection.lieux
                  .filter((l) => isPreview || l.status === "Publié")
                  .map(
                    (l) =>
                      (l.cover_media || l.médias?.[0]) && (
                        <LinkPreview to={`/lieux/${l.id}`} className="lieu-card">
                          <span className="title">
                            <img src={DestinationSVG(l.type[0]?.type_destination)} alt={l.type[0]?.type_destination} />
                            {l.nom}
                          </span>
                          <Media
                            media={l.cover_media || (l.médias?.[0] as MediaType)}
                            forceRatio="force-height"
                            cover
                            sizes="50vw"
                          />
                        </LinkPreview>
                      ),
                  )}
              </div>
              {smallScreen && (
                <div style={{ gridArea: "map" }}>
                  <SelectionMapMenu selectionId={selection.id} selection={selection} smallScreen={smallScreen} />
                </div>
              )}
            </>
          )}
        </>
      }
    />
  );
};

export const SelectionPage = withSize<{}>(_SelectionPage);
