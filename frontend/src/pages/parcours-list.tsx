import React from "react";
import { ParcoursType } from "../types";
import { Map } from "../components/map/map";
import { flatten } from "lodash";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import withSize from "../components/layout/with-size";
import config from "../config";
import { PageListLayout } from "../components/layout/page-list-layout";

const _ParcoursListPage: React.FC<{ width: number }> = ({ width }) => {
  const [parcours, loading] = useGetList<ParcoursType>("parcours");
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.sm;

  const parcoursListWithTitle = (
    <div
      className={`d-flex flex-column flex-grow-1 ${
        smallScreen ? "justify-content-start" : "justify-content-end"
      } max-height-but-logo`}
    >
      <div className="presentation">Retrouvez les parcours proposés par l'Ardepa.</div>
      <div className="page-list">
        {parcours?.map((p) => (
          <LinkPreview to={`/parcours/${p.id}`}>
            <div key={p.id} className="page-list-card">
              {p.cover_media && p.cover_media?.fichiers && (
                <div
                  className="page-list-cover"
                  style={{
                    backgroundImage: `url(${p.cover_media?.fichiers[0].thumbnails?.large?.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                  }}
                ></div>
              )}
              <div className="page-list-title overflow-auto">
                <div className="title">{p.nom}</div>
                <div className="subtitle">{p["sous-titre"]}</div>
              </div>
            </div>
          </LinkPreview>
        ))}
      </div>
    </div>
  );

  return (
    <PageListLayout
      menuSelectedItem="parcours"
      leftContent={parcoursListWithTitle}
      rightContent={
        smallScreen ? null : (
          <div className="w-100 h-100">
            {!loading && parcours && <Map lieux={flatten(parcours.map((p) => p.lieux))} className="listing-map" />}
            <Loader loading={loading} />
          </div>
        )
      }
    />
  );
};

export const ParcoursListPage = withSize<{}>(_ParcoursListPage);
