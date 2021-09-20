import React from "react";
import { ParcoursType } from "../types";
import { Map } from "../components/map/map";
import { flatten } from "lodash";
import { Media } from "../components/media/media";
import { PageLayout } from "../components/layout/page-layout";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";

export const ParcoursListPage: React.FC<{}> = () => {
  const [parcours, loading] = useGetList<ParcoursType>("parcours");

  return (
    <PageLayout
      menuSelectedItem="parcours"
      leftContent={
        <>
          <div className="presentation">Retrouvez les parcours proposés par l'Ardepa.</div>
          <div className="parcours-list">
            {parcours?.map((p) => (
              <LinkPreview to={`/parcours/${p.id}`}>
                <div key={p.id} className="parcours-card">
                  {p.cover_media && (
                    <div className="parcours-cover">
                      <Media media={p.cover_media} forceRatio="force-width" />
                    </div>
                  )}
                  <div className="parcours-title">
                    <h5>{p.nom}</h5>
                    <h6>{p["sous-titre"]}</h6>
                  </div>
                </div>
              </LinkPreview>
            ))}
          </div>
        </>
      }
      rightContent={
        <div style={{ gridArea: "2/1/2/4" }}>
          {!loading && parcours && <Map lieux={flatten(parcours.map((p) => p.lieux))} className="explore-map" />}
          <Loader loading={loading} />
        </div>
      }
    />
  );
};
