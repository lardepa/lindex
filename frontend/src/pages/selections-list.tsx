import React from "react";
import { SelectionType } from "../types";
import { Map } from "../components/map/map";
import { flatten } from "lodash";
import { PageLayout } from "../components/layout/page-layout";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import withSize from "../components/layout/with-size";
import config from "../config";

const _SelectionsListPage: React.FC<{ width: number }> = ({ width }) => {
  const [selections, loading] = useGetList<SelectionType>("selections");
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.sm;

  const selectionsListWithTitle = (
    <div
      className={`d-flex flex-column flex-grow-1 ${
        smallScreen ? "justify-content-start" : "justify-content-end"
      } max-height-but-logo`}
    >
      <div className="presentation">L'Ardepa invite des citoyens à vous faire découvrir l'architecture.</div>
      <div className="parcours-list">
        {selections?.map((s) => (
          <LinkPreview to={`/selections/${s.id}`}>
            <div key={s.id} className="parcours-card">
              {s.portrait && s.portrait?.fichiers && (
                <div
                  className="parcours-cover"
                  style={{
                    backgroundImage: `url(${s.portrait?.fichiers[0].thumbnails?.large?.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                  }}
                ></div>
              )}
              <div className="parcours-title">
                <div className="title">{s.invité}</div>
              </div>
            </div>
          </LinkPreview>
        ))}
      </div>{" "}
    </div>
  );
  return (
    <PageLayout
      menuSelectedItem="selections"
      leftContent={selectionsListWithTitle}
      rightContent={
        smallScreen ? null : (
          <div style={{ gridArea: "2/1/2/4" }}>
            {!loading && selections && <Map lieux={flatten(selections.map((s) => s.lieux))} className="listing-map" />}
            <Loader loading={loading} />
          </div>
        )
      }
    />
  );
};

export const SelectionsListPage = withSize<{}>(_SelectionsListPage);
