import React, { useEffect, useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const MapScale: React.FC<{ options: L.Control.ScaleOptions }> = ({ options }) => {
  const map = useMap();
  const [control] = useState(L.control.scale(options));
  useEffect(() => {
    control.addTo(map);
  }, [map, control]);

  return null;
};

export default MapScale;
