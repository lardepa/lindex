import React, { useState } from "react";
import { TbMapPin, TbMapPinOff } from "react-icons/tb";

import { ParcoursType } from "../types";
import { Map } from "../components/map/map";
import { flatten, fromPairs, groupBy, mapValues, pick, reverse, sortBy, toPairs } from "lodash";
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

  const [selectedParcours, setSelectedParcours] = useState<string[]>([]);

  const parcoursListWithTitle = (
    <div
      className={`d-flex flex-column flex-grow-1 ${
        smallScreen ? "justify-content-start" : "justify-content-end"
      } max-height-but-logo`}
    >
      <div className="presentation">Retrouvez les parcours proposés par l'Ardepa.</div>
      <div className="page-list">
        {reverse(sortBy(toPairs(groupBy(parcours, (p) => new Date(p.date).getFullYear())), ([y]) => y)).map(
          ([year, parcours], i) => (
            <details key={year} open={i === 0} className="page-list-year">
              <summary>{year}</summary>
              {parcours.map((p) => (
                <LinkPreview to={`/parcours/${p.id}`}>
                  <div key={p.id} className="page-list-card">
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
                      {selectedParcours.length > 0 && selectedParcours.includes(p.id) ? <TbMapPinOff /> : <TbMapPin />}
                    </button>
                  </div>
                </LinkPreview>
              ))}
            </details>
          ),
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
                lieux={flatten(
                  parcours
                    .filter((p) => selectedParcours.length === 0 || selectedParcours.includes(p.id))
                    .map((p) => p.lieux),
                )}
                itinaries={fromPairs(
                  parcours.map((p) => [p.id, p.lieux.map((l) => pick(l, ["id", "geolocalisation"]))]),
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

export const ParcoursListPage = withSize<{}>(_ParcoursListPage);
