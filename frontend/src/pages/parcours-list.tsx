import React from "react";
import { ParcoursType } from "../types";
import { Map } from "../components/map/map";
import { flatten } from "lodash";
import { PageLayout } from "../components/layout/page-layout";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import withSize from "../components/layout/with-size";
import config from "../config";

const _ParcoursListPage: React.FC<{ width: number }> = ({ width }) => {
  const [parcours, loading] = useGetList<ParcoursType>("parcours");
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.sm;

  const parcoursListWithTitle = (
    <>
      <div className="presentation">Retrouvez les parcours proposés par l'Ardepa.</div>
      <div className="parcours-list">
        {parcours?.map((p) => (
          <LinkPreview to={`/parcours/${p.id}`}>
            <div key={p.id} className="parcours-card">
              {p.cover_media && p.cover_media?.fichiers && (
                <div
                  className="parcours-cover"
                  style={{
                    backgroundImage: `url(${p.cover_media?.fichiers[0].thumbnails?.large?.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                  }}
                ></div>
              )}
              <div className="parcours-title">
                <div className="title">{p.nom}</div>
                <div className="subtitle">{p["sous-titre"]}</div>
              </div>
            </div>
          </LinkPreview>
        ))}
      </div>
    </>
  );

  return (
    <PageLayout
      menuSelectedItem="parcours"
      leftContent={smallScreen ? null : parcoursListWithTitle}
      rightContent={
        smallScreen ? (
          <div style={{ gridArea: "col-content", marginTop: "2rem" }}>{parcoursListWithTitle}</div>
        ) : (
          <div style={{ gridArea: "2/1/2/4" }}>
            {!loading && parcours && <Map lieux={flatten(parcours.map((p) => p.lieux))} className="explore-map" />}
            <Loader loading={loading} />
          </div>
        )
      }
    />
  );
};

export const ParcoursListPage = withSize<{}>(_ParcoursListPage);
