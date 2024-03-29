import { keys } from "lodash";
import React from "react";
import { GrDocumentPdf } from "react-icons/gr";
import Embed from "react-tiny-oembed";
import config from "../../config";
import { Attachment, MediaType } from "../../types";
import PDF from "./pdf";

export const fileUrl = (file: Attachment, version: "small" | "large" | "full"): string => {
  const ext = file.type.split("/").slice(-1)[0];
  return `${config.DATA_URL}/attachments/${file.id}/${version}.${ext}`;
};

const Figure: React.FC<{
  url: string;
  className?: string;
  pdf?: boolean;
  media: MediaType;
  sizes?: string;
  file: Attachment;
  onClick?: React.MouseEventHandler<HTMLElement>;
}> = ({ url, media, sizes, pdf, file, className, onClick }) => (
  <figure
    className={`media ${className ? className : ""} ${pdf ? "pdf-page" : ""}`}
    role={onClick && "button"}
    onClick={onClick}
  >
    {pdf && (
      <div className="action" title="PDF">
        <GrDocumentPdf />
      </div>
    )}

    <img
      src={url}
      alt={media.nom}
      title={media.nom}
      sizes={sizes}
      srcSet={keys(file.thumbnails)
        .map((size) => {
          const ext = file.type.split("/").slice(-1)[0];
          const thumbnail = file.thumbnails && ext !== "pdf" && file.thumbnails[size as "small" | "large" | "full"];
          if (thumbnail) return `${config.DATA_URL}/attachments/${file.id}/${size}.${ext} ${thumbnail.width}w,`;
          return "";
        })
        .join(" ")}
    />
    {media.credits && <div className="caption">{media.credits}</div>}
  </figure>
);

export const Media: React.FC<{
  media: MediaType;
  cover?: boolean;
  forceRatio?: "force-height" | "force-width";
  sizes?: string; // media queries to chose the right image size
  onClick?: React.MouseEventHandler<HTMLElement>;
}> = ({ media, sizes, cover, forceRatio, onClick }) => {
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
                  <div className={`media media-pdf w-100 h-100`}>
                    <PDF
                      key={f.id}
                      file={`${config.DATA_URL}/attachments/${f.id}/full.${ext}`}
                      ratio={ratio}
                      forceRatio={forceRatio}
                    />
                  </div>
                );
              else
                return (
                  <Figure
                    key={f.id}
                    pdf
                    url={`${config.DATA_URL}/attachments/${f.id}/large.png`}
                    media={media}
                    sizes={sizes}
                    file={f}
                    onClick={onClick}
                  />
                );
            default:
              return (
                <Figure
                  key={f.id}
                  url={`${config.DATA_URL}/attachments/${f.id}/full.${ext}`}
                  media={media}
                  sizes={sizes}
                  file={f}
                  onClick={onClick}
                />
              );
          }
        })}
      </>
    );
  }
  if (media.url) {
    return onClick ? (
      <div className="w-100 position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100" role="button" onClick={onClick} />
        <Embed url={media.url} />
      </div>
    ) : (
      <Embed url={media.url} />
    );
  }
  // bad media don't return nothing
  return <></>;
};
