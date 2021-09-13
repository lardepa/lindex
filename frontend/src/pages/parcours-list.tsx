import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { LieuType, ParcoursType } from "../types";
import config from "../config";
import { Map } from "../components/map/map";
import { Logo } from "../components/logo";
import { VerticalMenu } from "../components/layout/vertical-menu";
import { useQueryParamsState } from "../hooks/queryParams";
import { flatten } from "lodash";
import { Media } from "../components/media";
import { Link } from "react-router-dom";
import { HorizontalMenu } from "../components/layout/horizontal-menu";

export const ParcoursListPage: React.FC<{}> = () => {
  const [{ isPreview }] = useQueryParamsState();
  const [parcours, setParcours] = useState<ParcoursType[] | null>(null);
  useEffect(() => {
    get(`${config.DATA_URL}/parcours${isPreview ? "_preview" : ""}.json`, { responseType: "json" })
      .then((response) => setParcours(response.data))
      .catch((error) => console.error(error));
  }, [isPreview]);

  return (
    <div className="container-fluid" style={{ position: "relative" }}>
      <Logo />
      <div className="row full-height no-gutters">
        <div className="col-sm-6 col-xl-4 px-0 map-full-height overflow-auto d-flex flex-column justify-content-center">
          <div className="d-flex flex-column">
            <div className="presentation">Retrouvez les parcours proposés par l'Ardepa.</div>
            <div className="parcours-list">
              {parcours?.map((p) => (
                <Link to={`/parcours/${p.id}${isPreview ? "?preview" : ""}`}>
                  <div key={p.id} className="parcours-card">
                    {p.cover_media && <Media media={p.cover_media} />}
                    <div className="parcours-title">
                      <h4>{p.nom}</h4>
                      <h5>{p["sous-titre"]}</h5>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-8 px-0">
          <div className="d-flex flex-column map-full-height">
            <HorizontalMenu selected="parcours" />
            <div className="flex-grow-1">
              {parcours && <Map lieux={flatten(parcours.map((p) => p.lieux))} className="explore-map" />}
            </div>
          </div>
          {/* TODO:add a loader here */}
        </div>
      </div>
    </div>
  );
};
