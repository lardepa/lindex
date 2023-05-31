import React from "react";
import { LieuType } from "../types";
import { useParams } from "react-router-dom";
import { PageLayout } from "../components/layout/page-layout";
import { Lieu } from "../components/lieu/lieu";
import { useGetOne } from "../hooks/useAPI";
import { Loader } from "../components/loader";
import { LieuRelatedItems } from "../components/lieu/lieu-related-items";
import withSize from "../components/layout/with-size";
import { useQueryParamsState } from "../hooks/queryParams";
import { SelectionMapMenu } from "./selection-page";
import config from "../config";
import { ParcoursMapMenu } from "./parcours";

export const _LieuPage: React.FC<{ width: number }> = ({ width }) => {
  const { id } = useParams<{ id: string }>();
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
