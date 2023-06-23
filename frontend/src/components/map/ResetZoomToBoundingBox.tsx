import { useMap } from "react-leaflet";
import { LieuType } from "../../types";
import { useCenterMap } from "../../hooks/useCenterMap";
import { FC, useCallback, useEffect, useState } from "react";
import { TbZoomReset } from "react-icons/tb";

type P = { lieux: LieuType[] };

export const ResetZoomToBoundingBox: FC<P> = ({ lieux }) => {
  const map = useMap();
  const { centerMap, centerBoundingBox } = useCenterMap({ lieux, map });

  // FOLLOW map move to enable the reset zoom button
  const [enabled, setEnabled] = useState<boolean>(false);
  const onMove = useCallback(() => {
    if (centerBoundingBox) setEnabled(!map.getBounds().contains(centerBoundingBox));
  }, [centerBoundingBox, map]);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  return enabled ? (
    <div className="leaflet-bar d-flex justify-content-center align-items-center">
      <button className="btn bg-white p-0" onClick={(e) => centerMap()} style={{ width: "30px", height: "30px" }}>
        <TbZoomReset size="1.4rem" />
      </button>
    </div>
  ) : null;
};
