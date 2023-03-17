import React from "react";
import { MediaType, Attachment } from "../../types";
import Embed from "react-tiny-oembed";
import config from "../../config";
import PDF from "./pdf";
import PDFSVG from "./pdf.svg";

export const fileUrl = (file: Attachment, version: "small" | "large" | "full"): string => {
  const ext = file.type.split("/").slice(-1)[0];
  return `${config.DATA_URL}/attachments/${file.id}/${version}.${ext}`;
};

const Figure: React.FC<{
  url: string;
  className?: string;
  pdf?: boolean;
  media: MediaType;
  onClick?: React.MouseEventHandler<HTMLElement>;
}> = ({ url, media, pdf, className, onClick }) => (
  <figure className={`media ${className ? className : ""} ${pdf ? "pdf-page" : ""}`} onClick={onClick}>
    {pdf && media.fichiers && media.fichiers[0] && (
      <a href={`${config.DATA_URL}/attachments/${media.fichiers[0].id}/full.pdf`} rel="noreferrer">
        <img src={PDFSVG} alt="télécharger le PDF" className="action" />
      </a>
    )}
    <img src={url} alt={media.nom} title={media.nom} />
    {media.credits && <div className="caption">{media.credits}</div>}
  </figure>
);

export const Media: React.FC<{
  media: MediaType;
  cover?: boolean;
  forceRatio?: "force-height" | "force-width";
  onClick?: React.MouseEventHandler<HTMLElement>;
}> = ({ media, cover, forceRatio, onClick }) => {
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
                  <div className={`media media-pdf ${forceRatio}`}>
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
                    onClick={onClick}
                  />
                );
            default:
              return (
                <Figure
                  key={f.id}
                  url={`${config.DATA_URL}/attachments/${f.id}/full.${ext}`}
                  media={media}
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
        <div className="position-absolute top-0 start-0 w-100 h-100 cursor-pointer" onClick={onClick} />
        <Embed url={media.url} />
      </div>
    ) : (
      <Embed url={media.url} />
    );
  }
  // bad media don't return nothing
  return <></>;
};
