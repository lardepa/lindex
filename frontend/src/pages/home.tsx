import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { LieuType } from "../types";
import config from "../config";
import { Map } from "../components/map/map";
import { Logo } from "../components/logo";
import { VerticalMenu } from "../components/layout/vertical-menu";

export const Home: React.FC<{}> = () => {
  const [lieux, setLieux] = useState<LieuType[] | null>(null);
  useEffect(() => {
    get(`${config.DATA_URL}/lieux.json`, { responseType: "json" })
      .then((response) => setLieux(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container-fluid" style={{ position: "relative" }}>
      <Logo />
      <div className="row full-height no-gutters">
        <div className="col-sm-6 col-xl-4 px-0 map-full-height overflow-scroll d-flex flex-column justify-content-start">
          <div className="d-flex flex-column" style={{ margin: "auto 0" }}>
            <div className="presentation">
              Texte de présentation de la cartographie de l'Ardepa... azebzoae hzaomi jezmoejzami zjmazioj mzaioej
              zamijza miozaje mzoaij ezmaoijzmoijza emoiza jmzioj
            </div>
            <VerticalMenu />
          </div>
        </div>
        <div className="col-sm-6 col-xl-8 px-0">{lieux && <Map lieux={lieux} className="map-full-height" />}</div>
        {/* TODO:add a loader here */}
      </div>
    </div>
  );
};
