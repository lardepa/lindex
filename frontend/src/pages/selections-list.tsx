import React, { useEffect, useState } from "react";
import { TbMapPin, TbMapPinOff } from "react-icons/tb";

import { LieuType, SelectionType } from "../types";
import { Map } from "../components/map/map";
import { flatten, groupBy, reverse, sortBy, toPairs, uniqBy } from "lodash";
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

  const [visibleLieux, setVisibleLieux] = useState<LieuType[]>([]);
  const [selectedSelections, setSelectedSelections] = useState<string[]>([]);
  const [overLieu, setOverLieu] = useState<string | null>(null);
  const [highlightedLieux, setHighlightedLieux] = useState<Set<string>>(new Set());
  const [highlightedSelections, setHighlightedSelections] = useState<Set<string>>(new Set());

  // lieux to display on map
  useEffect(() => {
    if (selections)
      setVisibleLieux(
        uniqBy(
          flatten(
            selections
              .filter((s) => selectedSelections.length === 0 || selectedSelections.includes(s.id))
              .map((s) => s.lieux),
          ),
          (l) => l.id,
        ),
      );
  }, [selections, selectedSelections]);

  // Highlight lieux in same selection as the one beeing hovered
  useEffect(() => {
    if (overLieu && selections) {
      const hp = new Set<string>();
      const l = new Set<string>();
      selections.forEach((s) => {
        const ids = s.lieux.map((l) => l.id);
        if (ids.includes(overLieu)) {
          hp.add(s.id);
          ids.forEach((i) => l.add(i));
        }
      });
      setHighlightedLieux(l);
      setHighlightedSelections(hp);
    } else {
      setHighlightedSelections(new Set());
      setHighlightedLieux(new Set());
    }
  }, [selections, setHighlightedLieux, overLieu]);

  const selectionsListWithTitle = (
    <div
      className={`d-flex flex-column flex-grow-1 ${
        smallScreen ? "justify-content-start" : "justify-content-end"
      } max-height-but-logo`}
    >
      <div className="presentation">L'Ardepa invite des citoyens à vous faire découvrir l'architecture.</div>
      <div className="page-list">
        {reverse(sortBy(toPairs(groupBy(selections, (s) => new Date(s.date).getFullYear())), ([y]) => y)).map(
          ([year, yearSelections], i) => {
            const nbActiveSelections = yearSelections.filter(
              (s) => highlightedSelections.has(s.id) || selectedSelections.includes(s.id),
            ).length;
            return (
              <details key={year} open={i === 0} className="page-list-year alt">
                <summary>
                  <span className="position-relative pe-2">
                    {nbActiveSelections > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                        {nbActiveSelections}
                        <span className="visually-hidden">Selections survolées ou sélectionnées</span>
                      </span>
                    )}
                    <span className="position-relative">{year}</span>
                  </span>
                </summary>
                {yearSelections.map((s) => (
                  <LinkPreview key={s.id} to={`/selections/${s.id}`}>
                    <div
                      className="page-list-card"
                      style={{
                        opacity: highlightedSelections.size !== 0 && !highlightedSelections.has(s.id) ? 0.5 : 1,
                      }}
                      onMouseOver={() => {
                        setHighlightedSelections(new Set([s.id]));
                        setHighlightedLieux(new Set(s.lieux.map((l) => l.id)));
                      }}
                      onMouseOut={() => {
                        setHighlightedSelections(new Set([]));
                        setHighlightedLieux(new Set([]));
                      }}
                    >
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
            );
          },
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
                lieux={visibleLieux}
                className="listing-map"
                setOverLieu={setOverLieu}
                highlightedLieux={highlightedLieux}
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
