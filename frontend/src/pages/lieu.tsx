import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { LieuType } from "../types";
import config from "../config";
import { Logo } from "../components/logo";
import { Link, useParams } from "react-router-dom";
import { Media } from "../components/media";

export const LieuPage: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [lieu, setLieu] = useState<LieuType | null>(null);
  useEffect(() => {
    get(`${config.DATA_URL}/lieux/${id}.json`, { responseType: "json" })
      .then((response) => setLieu(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  return (
    <div className="container-fluid" style={{ position: "relative" }}>
      <Logo />
      <div className="row full-height no-gutters">
        <div className="col-sm-6 col-xl-2 px-0 map-full-height overflow-scroll d-flex flex-column justify-content-end">
          <div className="d-flex flex-column" style={{ margin: "auto 0" }}>
            {lieu?.parcours && lieu?.parcours.length > 0 && (
              <div>
                <h3>Parcours associés</h3>
                {lieu.parcours.map((p) => (
                  <Link to={`/parcours/${p.id}`}>{p.nom}</Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="col-sm-6 col-xl-4 px-0 map-full-height overflow-scroll d-flex flex-column justify-content-between">
          {lieu && (
            <>
              <div>
                <h1>{lieu.nom}</h1>
                <div className="presentation">{lieu.présentation}</div>
              </div>
              <div>
                <div> metadata</div>
              </div>
            </>
          )}
        </div>
        <div className="col-sm-6 col-xl-6 px-0 overflow-scroll full-height">
          {lieu?.cover_media && <Media media={lieu?.cover_media} />}
          {lieu?.médias?.map((m) => (
            <Media key={m.id} media={m} />
          ))}
        </div>
      </div>
    </div>
  );
};
