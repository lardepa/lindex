import { APropos, MentionsLegales } from "../pages/static-pages";
import { ExplorePage } from "../pages/explore";
import { Home } from "../pages/home";
import { LieuPage } from "../pages/lieu-page";
import { ParcoursPage } from "../pages/parcours";
import { ParcoursListPage } from "../pages/parcours-list";
import { SelectionPage } from "../pages/selection-page";
import { SelectionsListPage } from "../pages/selections-list";

// Definition of a route
export interface RouteDefinition {
  path: string;
  redirect?: string;
  component?: any;
  exact?: boolean;
  routes?: RouteDefinition[];
}

export const routes: RouteDefinition[] = [
  {
    path: "",
    redirect: "/",
    routes: [
      {
        path: "/lieux",
        redirect: "/explorer",
        routes: [{ path: "/:id", component: LieuPage }],
      },
      {
        path: "/",
        component: Home,
      },
      {
        path: "/parcours",
        component: ParcoursListPage,
        routes: [{ path: "/:id", component: ParcoursPage }],
      },
      {
        path: "/explorer/",
        component: ExplorePage,
      },
      {
        path: "/selections",
        component: SelectionsListPage,
        routes: [{ path: "/:id", component: SelectionPage }],
      },
      {
        path: "/a-propos",
        component: APropos,
      },
      {
        path: "/mentions-legales",
        component: MentionsLegales,
      },
    ],
  },
];
