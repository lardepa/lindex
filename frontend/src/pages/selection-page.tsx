import React from "react";
import { SelectionType } from "../types";
import { useParams } from "react-router-dom";
import { Media } from "../components/media/media";
import { useGetOne } from "../hooks/useAPI";
import { PageLayout } from "../components/layout/page-layout";
import ReactMarkdown from "react-markdown";

export const SelectionPage: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [selection, loading] = useGetOne<SelectionType>("selections", id);
  return (
    <PageLayout
      menuSelectedItem="selections"
      leftContent={<></>}
      rightContent={
        <>
          {!loading && selection && (
            <>
              <div style={{ gridArea: "col-content" }}>
                {selection?.portrait && <Media media={selection?.portrait} />}
                <h1>{selection.invité}</h1>
                TODO: metadata
              </div>
              <div style={{ gridArea: "main-content" }}>
                <ReactMarkdown>{selection?.édito}</ReactMarkdown>
              </div>
            </>
          )}
        </>
      }
    />
  );
};
