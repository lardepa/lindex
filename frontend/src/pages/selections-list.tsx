import React from "react";
import { SelectionType } from "../types";
import { Map } from "../components/map/map";
import { flatten, groupBy, reverse, sortBy, toPairs } from "lodash";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import withSize from "../components/layout/with-size";
import config from "../config";
import { PageListLayout } from "../components/layout/page-list-layout";

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
      <div className="page-list">
        {reverse(
          sortBy(toPairs(groupBy(selections, (s) => new Date(s["dernière modification"]).getFullYear())), ([y]) => y),
        ).map(([year, selections], i) => (
          <details open={i === 0}>
            <summary>{year}</summary>
            {selections.map((s) => (
              <LinkPreview to={`/selections/${s.id}`}>
                <div key={s.id} className="page-list-card">
                  {s.portrait && s.portrait?.fichiers && (
                    <div
                      className="page-list-cover"
                      style={{
                        backgroundImage: `url(${s.portrait?.fichiers[0].thumbnails?.large?.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                      }}
                    ></div>
                  )}
                  <div className="page-list-title">
                    <div className="title">
                      {s.invité} {new Date(s["dernière modification"]).getFullYear()}
                    </div>
                  </div>
                </div>
              </LinkPreview>
            ))}
          </details>
        ))}
      </div>{" "}
    </div>
  );
  return (
    <PageListLayout
      menuSelectedItem="selections"
      leftContent={selectionsListWithTitle}
      rightContent={
        smallScreen ? null : (
          <div className="w-100 h-100">
            {!loading && selections && <Map lieux={flatten(selections.map((s) => s.lieux))} className="listing-map" />}
            <Loader loading={loading} />
          </div>
        )
      }
    />
  );
};

export const SelectionsListPage = withSize<{}>(_SelectionsListPage);
