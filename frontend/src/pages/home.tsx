import React from "react";
import { BurgerMenu } from "../components/layout/BurgerMenu";
import { VerticalMenu } from "../components/layout/vertical-menu";
import { Loader } from "../components/loader";
import { Logo } from "../components/logo";
import { Map } from "../components/map/map";
import { NewsCarousel } from "../components/news-carousel";
import { useGetList } from "../hooks/useAPI";
import { LieuType } from "../types";

export const Home: React.FC<{}> = () => {
  const [lieux, loading] = useGetList<LieuType>("lieux");

  return (
    <div className="container-fluid">
      <div className="row full-height no-gutters">
        <div className="col-sm-6 col-lg-4 col-xl-3 px-0 overflow-hide d-flex flex-column justify-content-between context-menu">
          <BurgerMenu />
          <Logo />
          <div className="presentation">Une cartographie de l'architecture en Pays de la Loire.</div>
          <div>
            <NewsCarousel />
            <VerticalMenu />
          </div>
        </div>
        <div className="col-sm-6 col-lg-8 col-xl-9 px-0">
          {!loading && lieux && <Map lieux={lieux} className="full-responsive-height" />}
          <Loader loading={loading} />
        </div>
      </div>
    </div>
  );
};
