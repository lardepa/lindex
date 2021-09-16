import React from "react";
import { ParcoursType } from "../types";
import { Link, useParams } from "react-router-dom";
import { Media } from "../components/media/media";
import { Map } from "../components/map/map";
import { PageLayout } from "../components/layout/page-layout";
import ReactMarkdown from "react-markdown";
import { LinkPreview } from "../components/link-preview";
import { useGetOne } from "../hooks/useAPI";
import { Loader } from "../components/loader";

export const ParcoursPage: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [parcours, loading] = useGetOne<ParcoursType | null>("parcours", id);

  return (
    <PageLayout
      gridLayoutName="parcours-grid-area"
      menuSelectedItem="parcours"
      leftContent={
        <>
          {!loading && parcours && (
            <div className="d-flex flex-column flex-grow-1">
              <div className="rightHeader">{parcours["sous-titre"]}</div>
              {parcours.lieux && <Map lieux={parcours.lieux} className="half-height" itinary={true} />}
              <div className="steps flex-grow-1 parcours">
                {parcours.lieux.map((l, stepIndex) => (
                  // todo: change link to state in params
                  <Link to={`/lieux/${l.id}`} className="step" key={l.id}>
                    Étape {stepIndex}
                    <br />
                    <b>{l.nom}</b>
                  </Link>
                ))}
              </div>
              <LinkPreview className="menu-item" to="/parcours">
                Voir les autres parcours
              </LinkPreview>
            </div>
          )}
        </>
      }
      rightContent={
        <>
          {!loading && parcours && (
            <>
              <div className="flex-grow-1 metadata" style={{ gridArea: "col-content" }}>
                {parcours.cover_media && <Media media={parcours.cover_media} />}
                <h1>{parcours.nom}</h1>
                <h4>{parcours["sous-titre"]}</h4>
                {parcours.date && <h3>{Intl.DateTimeFormat("FR-fr").format(new Date(parcours.date))}</h3>}
              </div>
              <div className="flex-grow-2 edito" style={{ gridArea: "main-content" }}>
                <ReactMarkdown>{parcours.édito}</ReactMarkdown>
              </div>
              <div className="d-flex flex-row" style={{ gridArea: "footer" }}>
                {parcours?.médias?.map((m) => (
                  <Media key={m.id} media={m} />
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
