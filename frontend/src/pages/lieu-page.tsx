import React from "react";
import { LieuType } from "../types";
import { useParams } from "react-router-dom";
import { PageLayout } from "../components/layout/page-layout";
import { Lieu } from "../components/lieu/lieu";
import { useGetOne } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import { LieuRelatedItems } from "../components/lieu/lieu-related-items";

export const LieuPage: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [lieu, loading] = useGetOne<LieuType>("lieux", id);
  return (
    <PageLayout
      leftContent={<> {lieu && <LieuRelatedItems lieu={lieu} />}</>}
      rightContent={
        <>
          {!loading && lieu && <Lieu lieu={lieu} />}
          <Loader loading={loading} />
        </>
      }
    />
  );
};
