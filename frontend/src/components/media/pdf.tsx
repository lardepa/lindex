import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import withSize, { SizeState } from "../layout/with-size";
import { Loader } from "../loader";

import PDFSVG from "./pdf.svg";

// issue with webworker load through webpack see https://github.com/wojtekmaj/react-pdf/issues/291
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFLoader: React.FC<{ width: number | undefined; height: number | undefined }> = ({ width, height }) => (
  <div className="d-flex  align-items-center" style={{ width, height }}>
    <Loader loading={true} />
  </div>
);

//TODO: move to separate file?
interface PDFProps {
  file: string;
  ratio: number | undefined;
  forceRatio?: "force-height" | "force-width";
}
const _PDF: React.FC<PDFProps & SizeState> = ({ file, ratio, forceRatio, width, height }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  const pageSelectionHeight = 40;
  const pageWidth =
    forceRatio === "force-width" || (!forceRatio && ratio && ratio <= 1)
      ? width - (window.scrollbars ? 2 : 0)
      : undefined;
  const pageHeight =
    forceRatio === "force-height" || (!forceRatio && ratio && ratio >= 1)
      ? height - (numPages && numPages > 1 ? pageSelectionHeight : 0)
      : undefined;
  const realWidth = pageWidth || (pageHeight && pageHeight / (ratio || 1));
  const realHeight = pageHeight || (pageWidth && pageWidth * (ratio || 1));
  const buttonStyle = { padding: "0.3rem" };
  return (
    <div
      className={`d-flex flex-column align-content-center ${
        forceRatio === "force-height" || (!forceRatio && ratio && ratio >= 1) ? "h-100" : "w-100"
      }`}
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<PDFLoader width={realWidth} height={realHeight} />}
      >
        <a href={file} rel="noreferrer">
          <img src={PDFSVG} alt="télécharger le PDF" className="action" />
        </a>
        <Page
          className="pdf-page"
          pageNumber={pageNumber}
          height={pageHeight}
          width={pageWidth}
          loading={<PDFLoader width={realWidth} height={realHeight} />}
        ></Page>
        {numPages && numPages > 1 && (
          <div
            className="d-flex justify-content-between align-items-center p-1"
            style={{ width: realWidth, height: `${pageSelectionHeight}px` }}
          >
            <button
              className="btn"
              style={buttonStyle}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              &lt;
            </button>
            <span>
              Page {pageNumber} sur {numPages}
            </span>
            <button
              className="btn"
              style={buttonStyle}
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </Document>
    </div>
  );
};
const PDF = withSize<PDFProps>(_PDF);
export default PDF;
