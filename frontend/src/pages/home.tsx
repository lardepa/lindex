import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Lieu } from "../types";
import config from "../config.json";
import { values } from "lodash";
import { Map } from "../components/map/map";
import { Logo } from "../components/logo";

export const Home: React.FC<{}> = () => {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  useEffect(() => {
    get(`${config.DATA_URL}/lieux.json`, { responseType: "json" })
      .then((response) => setLieux(values(response.data)))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container-xl" style={{ position: "relative" }}>
      <Logo />
      <div className="row full-height no-gutters">
        <div className="col-sm  d-flex flex-column justify-content-center px-0">
          <div className="presentation">
            Texte de présentation de la cartographie de l'Ardepa... azebzoae hzaomi jezmoejzami zjmazioj mzaioej zamijza
            miozaje mzoaij ezmaoijzmoijza emoiza jmzioj
          </div>
          <div className="menu">
            <div>Explorer la carte</div>
            <div>Sélections des invités</div>
            <div>Parcours</div>
            <div>Random</div>
          </div>
        </div>
        <div className="col-sm px-0">
          <Map lieux={lieux} className="map-full-height" />
        </div>
      </div>
    </div>
  );
};
