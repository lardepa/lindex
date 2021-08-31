import { Home } from "../pages/home";
import { LieuPage } from "../pages/lieu";

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
    ],
  },
];
