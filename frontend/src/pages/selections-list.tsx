import React, { useState } from "react";
import { TbMapPin, TbMapPinOff } from "react-icons/tb";

import { SelectionType } from "../types";
import { Map } from "../components/map/map";
import { flatten, groupBy, reverse, sortBy, toPairs } from "lodash";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import withSize from "../components/layout/with-size";
import config from "../config";
import { PageListLayout } from "../components/layout/page-list-layout";
import { fileUrl } from "../components/media/media";

const _SelectionsListPage: React.FC<{ width: number }> = ({ width }) => {
  const [selections, loading] = useGetList<SelectionType>("selections");
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.sm;

  const [selectedSelections, setSelectedSelections] = useState<string[]>([]);

  const selectionsListWithTitle = (
    <div
      className={`d-flex flex-column flex-grow-1 ${
        smallScreen ? "justify-content-start" : "justify-content-end"
      } max-height-but-logo`}
    >
      <div className="presentation">L'Ardepa invite des citoyens à vous faire découvrir l'architecture.</div>
      <div className="page-list">
        {reverse(sortBy(toPairs(groupBy(selections, (s) => new Date(s.date).getFullYear())), ([y]) => y)).map(
          ([year, selections], i) => (
            <details key={year} open={i === 0} className="page-list-year alt">
              <summary>{year}</summary>
              {selections.map((s) => (
                <LinkPreview key={s.id} to={`/selections/${s.id}`}>
                  <div className="page-list-card">
                    {s.portrait && s.portrait?.fichiers && (
                      <div
                        className="page-list-cover"
                        style={{
                          backgroundImage: `url(${fileUrl(s.portrait?.fichiers[0], "large")})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      ></div>
                    )}
                    <div className="page-list-title">
                      <div className="title">{s.invité}</div>
                      <div className="subtitle">{s["sous-titre"]}</div>
                    </div>
                    <button
                      className="btn btn-icon page-list-action"
                      title="Afficher sur la carte"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (selectedSelections.includes(s.id))
                          setSelectedSelections(selectedSelections.filter((id) => id !== s.id));
                        else setSelectedSelections([...selectedSelections, s.id]);
                      }}
                    >
                      {s.lieux.length}
                      {selectedSelections.length === 0 || selectedSelections.includes(s.id) ? (
                        <TbMapPin />
                      ) : (
                        <TbMapPinOff />
                      )}
                    </button>
                  </div>
                </LinkPreview>
              ))}
            </details>
          ),
        )}
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
            {!loading && selections && (
              <Map
                lieux={flatten(
                  selections
                    .filter((s) => selectedSelections.length === 0 || selectedSelections.includes(s.id))
                    .map((s) => s.lieux),
                )}
                className="listing-map"
              />
            )}
            <Loader loading={loading} />
          </div>
        )
      }
    />
  );
};

export const SelectionsListPage = withSize<{}>(_SelectionsListPage);
