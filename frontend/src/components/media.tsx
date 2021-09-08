import React, { useState } from "react";
import { MediaType } from "../types";
import config from "../config";
import Embed from "react-tiny-oembed";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
// issue with webworker load through webpack see https://github.com/wojtekmaj/react-pdf/issues/291
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//TODO: move to separate file?
//TODO: add next/pevious page buttons
const PDF: React.FC<{ file: string }> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

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
              return <PDF key={f.id} file={f.url} />; // {`${config.DATA_URL}/attachments/${f.id}/full.${ext}`} />;
            default:
              return (
                <img
                  key={f.id}
                  src={f.thumbnails?.large.url} //{`${config.DATA_URL}/attachments/${f.id}/large.${ext}`}
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
