import React from "react";
import { MediaType } from "../../types";
import Embed from "react-tiny-oembed";
import config from "../../config";
import PDF from "./pdf";

export const Media: React.FC<{ media: MediaType }> = ({ media }) => {
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
              const forceRatio = ratio && ratio > 1 ? "force-portrait" : "force-landscape";
              return (
                <div className={forceRatio}>
                  <PDF key={f.id} file={`${config.DATA_URL}/attachments/${f.id}/full.${ext}`} ratio={ratio} />
                </div>
              );
            default:
              return (
                <img
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
