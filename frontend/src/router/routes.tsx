import { Navigate, RouteObject } from "react-router-dom";
import { ExplorePage } from "../pages/explore";
import { Home } from "../pages/home";
import { LieuPage } from "../pages/lieu-page";
import { ParcoursPage } from "../pages/parcours";
import { ParcoursListPage } from "../pages/parcours-list";
import { SelectionPage } from "../pages/selection-page";
import { SelectionsListPage } from "../pages/selections-list";
import { APropos, Glossaire } from "../pages/static-pages";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "lieux/:id",
    element: <LieuPage />,
  },
  {
    path: "lieux",
    element: <Navigate to="/explorer" />,
  },
  { path: "parcours/:id", element: <ParcoursPage /> },
  {
    path: "parcours",
    element: <ParcoursListPage />,
  },
  {
    path: "explorer",
    element: <ExplorePage />,
  },
  { path: "selections/:id", element: <SelectionPage /> },
  {
    path: "selections",
    element: <SelectionsListPage />,
  },
  {
    path: "a-propos",
    element: <APropos />,
  },
  {
    path: "glossaire",
    element: <Glossaire />,
  },
];
