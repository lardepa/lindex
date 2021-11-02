import React from "react";
import { MediaType } from "../../types";
import Embed from "react-tiny-oembed";
import config from "../../config";
import PDF from "./pdf";

const Figure: React.FC<{ url: string; media: MediaType }> = ({ url, media }) => (
  <figure className="media">
    <img src={url} alt={media.nom} title={media.nom} />
    {media.credits && <div className="caption">{media.credits}</div>}
  </figure>
);

export const Media: React.FC<{ media: MediaType; cover?: boolean; forceRatio?: "force-height" | "force-width" }> = ({
  media,
  cover,
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
              if (!forceRatio) forceRatio = ratio && ratio >= 1 ? "force-height" : "force-width";
              if (!cover)
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
              else return <Figure key={f.id} url={`${config.DATA_URL}/attachments/${f.id}/large.png`} media={media} />;
            default:
              return <Figure key={f.id} url={`${config.DATA_URL}/attachments/${f.id}/full.${ext}`} media={media} />;
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
