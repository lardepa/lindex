import React from "react";
import { LieuType } from "../types";
import { useParams } from "react-router-dom";
import { PageLayout } from "../components/layout/page-layout";
import { Lieu } from "../components/lieu";
import { useGetOne } from "../hooks/useAPI";
import { Loader } from "../components/loader";

export const LieuPage: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [lieu, loading] = useGetOne<LieuType>("lieux", id);
  return (
    <PageLayout
      leftContent={<>TODO</>}
      rightContent={
        <>
          {!loading && lieu && <Lieu lieu={lieu} />}
          <Loader loading={loading} />
        </>
      }
    />
  );
};
