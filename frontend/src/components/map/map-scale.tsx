import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const MapScale: React.FC<{ options: L.Control.ScaleOptions }> = ({ options }) => {
  const map = useMap();

  useEffect(() => {
    L.control.scale(options).addTo(map);
  }, [map, options]);

  return null;
};

export default MapScale;
