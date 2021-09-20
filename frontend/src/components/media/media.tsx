import React from "react";
import { MediaType } from "../../types";
import Embed from "react-tiny-oembed";
import config from "../../config";
import PDF from "./pdf";

export const Media: React.FC<{ media: MediaType; forceRatio?: "force-height" | "force-width" }> = ({
  media,
  forceRatio,
}) => {
  // media as files
  if (media.fichiers && media.fichiers.length > 0) {
    return (
      <>
        {" "}
        {media.fichiers.map((f) => {
          const ext = f.type.split("/").slice(-1)[0];
          switch (ext) {
            case "pdf":
              // PDF file is stored under full quality (other are thumbnail of first page)
              const ratio: number | undefined = f.thumbnails && f.thumbnails?.large.height / f.thumbnails?.large.width;
              if (!forceRatio) forceRatio = ratio && ratio > 1 ? "force-height" : "force-width";
              return (
                <div className={`media ${forceRatio}`}>
                  <PDF
                    key={f.id}
                    file={`${config.DATA_URL}/attachments/${f.id}/full.${ext}`}
                    ratio={ratio}
                    forceRatio={forceRatio}
                  />
                </div>
              );
            default:
              return (
                <img
                  className="media"
                  key={f.id}
                  src={`${config.DATA_URL}/attachments/${f.id}/full.${ext}`}
                  alt={media.nom}
                  title={media.credits}
                />
              );
          }
        })}
      </>
    );
  }
  if (media.url) {
    return <Embed url={media.url} />;
  }
  // bad media don't return nothing
  return <></>;
};
