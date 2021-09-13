import React from "react";
import { LieuType } from "../types";
import { Map } from "../components/map/map";
import { Logo } from "../components/logo";
import { VerticalMenu } from "../components/layout/vertical-menu";
import { useGetList } from "../hooks/useAPI";

export const Home: React.FC<{}> = () => {
  const lieux = useGetList<LieuType>("lieux");

  return (
    <div className="container-fluid">
      <div className="row full-height no-gutters">
        <div className="col-sm-6 col-lg-4 col-xl-3 px-0 full-responsive-height overflow-auto d-flex flex-column justify-content-between">
          <Logo />
          <div className="presentation">
            Texte de présentation de la cartographie de l'Ardepa... azebzoae hzaomi jezmoejzami zjmazioj mzaioej zamijza
            miozaje mzoaij ezmaoijzmoijza emoiza jmzioj
          </div>
          {/* TODO add "in home" card */}
          <VerticalMenu />
        </div>
        <div className="col-sm-6 col-lg-8 col-xl-9 px-0">
          {lieux && <Map lieux={lieux} className="full-responsive-height" />}
        </div>
        {/* TODO:add a loader here */}
      </div>
    </div>
  );
};
