import { APropos } from "../pages/a-propos";
import { ExplorePage } from "../pages/explore";
import { Home } from "../pages/home";
import { LieuPage } from "../pages/lieu-page";
import { MentionsLegales } from "../pages/mentions-legales";
import { ParcoursPage } from "../pages/parcours";
import { ParcoursListPage } from "../pages/parcours-list";
import { SelectionsPage } from "../pages/selections";

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
        path: "/lieu/:id",
        component: LieuPage,
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
        path: "/selections/",
        component: SelectionsPage,
        routes: [{ path: "/:id", component: SelectionsPage }],
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
