import { createControlComponent } from "@react-leaflet/core";
import * as L from "leaflet";

import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";

type P = L.ControlOptions & L.Control.LocateOptions;

const { Locate } = L.Control;

function createLocateInstance(props: P) {
  const instance = new Locate(props);

  return instance;
}

export const LocateControl = createControlComponent(createLocateInstance);
