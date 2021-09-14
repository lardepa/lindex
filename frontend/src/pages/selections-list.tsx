import React from "react";
import { SelectionType } from "../types";
import { Map } from "../components/map/map";
import { flatten } from "lodash";
import { Media } from "../components/media";
import { PageLayout } from "../components/layout/page-layout";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";

export const SelectionsListPage: React.FC<{}> = () => {
  const [selections, loading] = useGetList<SelectionType>("selections");

  return (
    <PageLayout
      menuSelectedItem="selections"
      leftContent={
        <>
          <div className="presentation">L'Ardepa invite des citoyens à vosu faire découvrir l'architecture.</div>
          <div className="parcours-list">
            {selections?.map((s) => (
              <LinkPreview to={`/selections/${s.id}`}>
                <div key={s.id} className="parcours-card">
                  {s.portrait && <Media media={s.portrait} />}
                  <div className="parcours-title">
                    <h5>{s.invité}</h5>
                    <h6>TODO: add profession</h6>
                  </div>
                </div>
              </LinkPreview>
            ))}
          </div>
        </>
      }
      rightContent={
        <div style={{ gridArea: "2/1/2/4" }}>
          {!loading && selections && <Map lieux={flatten(selections.map((s) => s.lieux))} className="explore-map" />}
          <Loader loading={loading} />
        </div>
      }
    />
  );
};
