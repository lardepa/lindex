import React, { useEffect, useState } from "react";
import { TbMapPin, TbMapPinOff } from "react-icons/tb";

import { LieuType, ParcoursType } from "../types";
import { Map } from "../components/map/map";
import { flatten, fromPairs, groupBy, pick, reverse, sortBy, toPairs, uniqBy } from "lodash";
import { LinkPreview } from "../components/link-preview";
import { useGetList } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import withSize from "../components/layout/with-size";
import config from "../config";
import { PageListLayout } from "../components/layout/page-list-layout";
import { fileUrl } from "../components/media/media";

const _ParcoursListPage: React.FC<{ width: number }> = ({ width }) => {
  const [parcours, loading] = useGetList<ParcoursType>("parcours");
  const smallScreen = width && width <= config.RESPONSIVE_BREAKPOINTS.sm;

  const [visibleLieux, setVisibleLieux] = useState<LieuType[]>([]);
  const [selectedParcours, setSelectedParcours] = useState<string[]>([]);
  const [overLieu, setOverLieu] = useState<string | null>(null);
  const [highlightedLieux, setHighlightedLieux] = useState<Set<string>>(new Set());
  const [highlightedParcours, setHighlightedParcours] = useState<Set<string>>(new Set());

  // lieux to display on map
  useEffect(() => {
    if (parcours)
      setVisibleLieux(
        uniqBy(
          flatten(
            parcours
              .filter((s) => selectedParcours.length === 0 || selectedParcours.includes(s.id))
              .map((s) => s.lieux),
          ),
          (l) => l.id,
        ),
      );
  }, [parcours, selectedParcours]);

  useEffect(() => {
    if (overLieu) {
      const hp = new Set<string>();
      setHighlightedLieux(
        new Set(
          flatten(
            parcours?.map((p) => {
              const ids = p.lieux.map((l) => l.id);
              if (ids.includes(overLieu)) {
                hp.add(p.id);
                return ids;
              }
              return [];
            }),
          ),
        ),
      );
      setHighlightedParcours(hp);
    } else {
      setHighlightedParcours(new Set());
      setHighlightedLieux(new Set());
    }
  }, [parcours, setHighlightedLieux, overLieu]);

  const parcoursListWithTitle = (
    <div
      className={`d-flex flex-column flex-grow-1 ${
        smallScreen ? "justify-content-start" : "justify-content-end"
      } max-height-but-logo`}
    >
      <div className="presentation">Retrouvez les parcours proposés par l'Ardepa.</div>
      <div className="page-list">
        {reverse(sortBy(toPairs(groupBy(parcours, (p) => new Date(p.date).getFullYear())), ([y]) => y)).map(
          ([year, yearParcours], i) => {
            const nbSelectedParcours = yearParcours.filter((s) => selectedParcours.includes(s.id)).length;
            const nbHighlightedParcours = yearParcours.filter((s) => highlightedParcours.has(s.id)).length;

            const nbActiveParcours = yearParcours.filter(
              (s) => highlightedParcours.has(s.id) || selectedParcours.includes(s.id),
            ).length;
            return (
              <details key={year} open={i === 0} className="page-list-year">
                <summary>
                  <span className="position-relative pe-2">
                    <span className="position-relative">{year}</span>
                    {nbActiveParcours > 0 && (
                      <span
                        className={`active-badge badge rounded-circle ms-1  
                            ${nbHighlightedParcours > 0 ? "parcours-highlighted" : ""}
                            ${nbSelectedParcours > 0 ? "parcours-selected" : ""}`}
                      >
                        {nbActiveParcours}
                        <span className="visually-hidden">Parcours survolées ou sélectionnées</span>
                      </span>
                    )}
                  </span>
                </summary>
                <div className={`year-grid solo-child`}>
                  {yearParcours.map((p) => (
                    <LinkPreview to={`/parcours/${p.id}`}>
                      <div
                        key={p.id}
                        className={`page-list-card 
                              ${highlightedParcours.has(p.id) ? "parcours-highlighted" : ""}
                             ${selectedParcours.includes(p.id) ? "parcours-selected" : ""}`}
                        // style={{ opacity: highlightedParcours.size !== 0 && !highlightedParcours.has(p.id) ? 0.5 : 1 }}
                        onMouseOver={() => {
                          if (selectedParcours.length === 0 || selectedParcours.includes(p.id)) {
                            setHighlightedParcours(new Set([p.id]));
                            setHighlightedLieux(new Set(p.lieux.map((l) => l.id)));
                          }
                        }}
                        onMouseOut={() => {
                          setHighlightedParcours(new Set([]));
                          setHighlightedLieux(new Set([]));
                        }}
                      >
                        {p.cover_media && p.cover_media?.fichiers && (
                          <div
                            className="page-list-cover"
                            style={{
                              backgroundImage: `url(${fileUrl(p.cover_media?.fichiers[0], "large")})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center center",
                            }}
                          ></div>
                        )}
                        <div className="page-list-title overflow-auto">
                          <div className="title">{p.nom}</div>
                          <div className="subtitle">{p["sous-titre"]}</div>
                        </div>
                        <button
                          className="btn btn-icon page-list-action"
                          title="Afficher sur la carte"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (selectedParcours.includes(p.id))
                              setSelectedParcours(selectedParcours.filter((id) => id !== p.id));
                            else setSelectedParcours([...selectedParcours, p.id]);
                          }}
                        >
                          {p.lieux.length}
                          {selectedParcours.length > 0 && selectedParcours.includes(p.id) ? (
                            <TbMapPinOff />
                          ) : (
                            <TbMapPin />
                          )}
                        </button>
                      </div>
                    </LinkPreview>
                  ))}
                </div>
              </details>
            );
          },
        )}
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
            {!loading && parcours && (
              <Map
                lieux={visibleLieux}
                itinaries={fromPairs(
                  parcours
                    .filter((p) => selectedParcours.length === 0 || selectedParcours.includes(p.id))
                    .map((p) => [p.id, p.lieux.map((l) => pick(l, ["id", "geolocalisation"]))]),
                )}
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

export const ParcoursListPage = withSize<{}>(_ParcoursListPage);
