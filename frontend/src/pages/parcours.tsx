import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { ParcoursType } from "../types";
import config from "../config.json";
import { Logo } from "../components/logo";
import { useParams } from "react-router-dom";
import { Media } from "../components/media";
import { Map } from "../components/map/map";

export const ParcoursPage: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [parcours, setParcours] = useState<ParcoursType | null>(null);
  useEffect(() => {
    get(`${config.DATA_URL}/data/parcours/${id}.json`, { responseType: "json" })
      .then((response) => setParcours(response.data))
      .catch((error) => console.error(error));
  }, [id]);
  return (
    <div className="container-fluid" style={{ position: "relative" }}>
      <Logo />
      <div className="row full-height no-gutters">
        <div className="col-sm-3 col-xl-2 px-0 map-full-height overflow-scroll d-flex flex-column justify-content-end">
          <div className="d-flex flex-column" style={{ margin: "auto 0" }}></div>
        </div>
        <div className="col-sm-3 col-xl-4 px-0 map-full-height overflow-scroll d-flex flex-column justify-content-between">
          {parcours && (
            <>
              <div>
                <h1>{parcours.nom}</h1>
                {parcours.date && <h3>{Intl.DateTimeFormat("FR-fr").format(new Date(parcours.date))}</h3>}
                {/*  */}
                <div className="presentation">{parcours.édito}</div>
              </div>
              <div>
                <div> metadata</div>
              </div>
            </>
          )}
        </div>
        <div className="col-sm-6 col-xl-6 px-0 overflow-scroll full-height d-flex flex-column">
          <div className="d-flex flex-row overflow-scroll">
            {parcours?.cover_media && <Media media={parcours?.cover_media} />}
            {parcours?.médias?.map((m) => (
              <Media key={m.id} media={m} />
            ))}
          </div>
          <div>{parcours?.lieux && <Map lieux={parcours.lieux} className="half-height" itinary={true} />}</div>
        </div>
      </div>
    </div>
  );
};
