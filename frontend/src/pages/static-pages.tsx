import React, { useEffect } from "react";
import { Logo } from "../components/logo";
import { VerticalMenu } from "../components/layout/vertical-menu";
import { useGetList } from "../hooks/useAPI";
import { ContenuType } from "../types";
import { NewsCarousel } from "../components/news-carousel";
import { Loader } from "../components/loader";
import ReactMarkdown from "react-markdown";
import { StatiPageContent } from "../types.frontend";
import { Link, useLocation } from "react-router-dom";
import { BurgerMenu } from "../components/layout/BurgerMenu";
import { Media } from "../components/media/media";

const StaticPage: React.FC<{ contentType: StatiPageContent }> = ({ contentType }) => {
  const [contenus, loading] = useGetList<ContenuType>(contentType.modelName);
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "") {
      setTimeout(() => {
        const title = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (title) title.scrollIntoView();
      }, 0);
    }
  }, [location.hash]);

  return (
    <div className="container-fluid">
      <div className="row full-height no-gutters">
        <div
          className="col-sm-6 col-lg-4 col-xl-3 px-0 overflow-auto d-flex flex-column justify-content-between"
          id="left-menu"
        >
          <BurgerMenu />
          <Logo />
          <div className="presentation">Une cartographie de l'architecture en Pays de la Loire.</div>
          <div>
            <NewsCarousel />
            <VerticalMenu />
          </div>
        </div>

        {!loading && contenus && (
          <>
            <div className="d-none d-sm-none d-lg-flex col-lg-2 col-xl-2 px-0">
              <nav className="nav vertical-menu  d-flex w-100">
                {contenus?.map((c) => (
                  <Link to={{ hash: encodeURIComponent(c.section) }} key={c.id} className="menu-item">
                    {c.section}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="col-sm-6 col-lg-6 col-xl-7 p-3 full-height  overflow-scroll">
              <h1>{contentType.title}</h1>
              {contenus.map((c) => (
                <div key={c.id}>
                  <h2
                    id={c.section}
                    className={decodeURIComponent(location.hash).includes(c.section) ? "selected" : ""}
                  >
                    {c.section}
                  </h2>
                  <ReactMarkdown className="long-text">{c.contenu}</ReactMarkdown>
                  {c.médias && (
                    <div className={"horizontal-carousel section-gallery "}>
                      {c?.médias.map((m, i) => (
                        <Media media={m} cover key={i} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        <Loader loading={loading} />
      </div>
    </div>
  );
};

export const APropos: React.FC<{}> = () => <StaticPage contentType={{ modelName: "a_propos", title: "À Propos" }} />;
export const Glossaire: React.FC<{}> = () => (
  <StaticPage contentType={{ modelName: "glossaire", title: "Glossaire" }} />
);
