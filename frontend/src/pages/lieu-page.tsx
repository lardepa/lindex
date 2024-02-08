import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "../components/layout/page-layout";
import withSize from "../components/layout/with-size";
import { Lieu } from "../components/lieu/lieu";
import { LieuRelatedItems } from "../components/lieu/lieu-related-items";
import { Loader } from "../components/loader";
import config from "../config";
import { useQueryParamsState } from "../hooks/queryParams";
import { useGetOne } from "../hooks/useAPI";
import { LieuType } from "../types";
import { ParcoursMapMenu } from "./parcours";
import { SelectionMapMenu } from "./selection-page";

export const _LieuPage: React.FC<{ width: number }> = ({ width }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  if (!id) {
    navigate("/explorer");
    return null;
  }
  const [lieu, loading] = useGetOne<LieuType>("lieux", id);
  const [queryParamState] = useQueryParamsState();
  const smallScreen = width <= config.RESPONSIVE_BREAKPOINTS.md;
  return (
    <PageLayout
      leftContent={
        <>
          {lieu && !queryParamState.selection && !queryParamState.parcours && <LieuRelatedItems lieu={lieu} />}
          {queryParamState.selection && (
            <SelectionMapMenu selectionId={queryParamState.selection} smallScreen={smallScreen} />
          )}
          {queryParamState.parcours && (
            <ParcoursMapMenu parcoursId={queryParamState.parcours} smallScreen={smallScreen} />
          )}
        </>
      }
      rightContent={
        <>
          {!loading && lieu && <Lieu lieu={lieu} width={width} />}
          <Loader loading={loading} />
        </>
      }
    />
  );
};

export const LieuPage = withSize<{}>(_LieuPage);
