import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useLocation } from "react-router-dom";
import { PageLayout } from "../components/layout/page-layout";
import { VerticalMenu } from "../components/layout/vertical-menu";
import { Loader } from "../components/loader";
import { Media } from "../components/media/media";
import { NewsCarousel } from "../components/news-carousel";
import { useGetList } from "../hooks/useAPI";
import { ContenuType } from "../types";
import { StatiPageContent } from "../types.frontend";

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
    <PageLayout
      hideHorizontalMenu
      leftContent={
        <>
          <div className="presentation">Une cartographie de l'architecture en Pays de la Loire.</div>
          <div>
            <NewsCarousel />
            <VerticalMenu />
          </div>
        </>
      }
      rightContent={
        <>
          {!loading && contenus && (
            <>
              <div
                style={{ gridArea: "col-content", marginTop: "0.6rem" }}
                className={`d-flex flex-column justify-content-start d-none d-sm-none d-lg-flex `}
              >
                <nav className="nav vertical-menu-static  d-flex w-100">
                  {contenus?.map((c) => (
                    <Link to={{ hash: encodeURIComponent(c.section) }} key={c.id} className="menu-item">
                      {c.section}
                    </Link>
                  ))}
                </nav>
              </div>
              <div
                className=" px-3 static-content"
                style={{ gridArea: "main-content", overflowY: "auto", overflowX: "hidden", paddingTop: "1em" }}
              >
                {contenus.map((c) => (
                  <div key={c.id}>
                    <h1
                      id={c.section}
                      className={decodeURIComponent(location.hash).includes(c.section) ? "selected" : ""}
                    >
                      {c.section}
                    </h1>
                    {c.chapeau && <ReactMarkdown className="long-text introduction-text">{c.chapeau}</ReactMarkdown>}
                    {c.definitions !== undefined && (
                      <>
                        {c.definitions.map((d, i) =>
                          d.description ? (
                            <div key={i} className="glossary-entry">
                              <div className="long-text introduction-text">{d.nom}</div>
                              <ReactMarkdown className="definition long-text long-text-static">
                                {d.description}
                              </ReactMarkdown>
                            </div>
                          ) : null,
                        )}
                      </>
                    )}
                    {c.contenu && <ReactMarkdown className="long-text">{c.contenu}</ReactMarkdown>}
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
        </>
      }
    />
  );
};

export const APropos: React.FC<{}> = () => <StaticPage contentType={{ modelName: "a_propos", title: "À Propos" }} />;
export const Glossaire: React.FC<{}> = () => (
  <StaticPage contentType={{ modelName: "glossaire", title: "Glossaire" }} />
);
