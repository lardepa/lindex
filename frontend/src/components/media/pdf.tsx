import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import withSize, { SizeState } from "../layout/with-size";
import { Loader } from "../loader";

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
}
const _PDF: React.FC<PDFProps & SizeState> = ({ file, ratio, width, height }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const pageWidth = ratio && ratio < 1 ? width : undefined;
  const pageHeight = ratio && ratio < 1 ? undefined : window.innerHeight * 0.7;
  const realWidth = pageWidth || (pageHeight && pageHeight / (ratio || 1));
  const realHeight = pageHeight || (pageWidth && pageWidth * (ratio || 1));
  return (
    <div className="d-flex flex-column align-content-center">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<PDFLoader width={realWidth} height={realHeight} />}
      >
        <Page
          className="pdf-page"
          pageNumber={pageNumber}
          height={pageHeight}
          width={pageWidth}
          loading={<PDFLoader width={realWidth} height={realHeight} />}
        ></Page>
        {numPages && numPages > 1 && (
          <div className="d-flex justify-content-between align-items-center" style={{ width: realWidth }}>
            <button className="btn" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
              {" "}
              &lt;
            </button>
            <span>
              Page {pageNumber} sur {numPages}
            </span>
            <button className="btn" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
              {" "}
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
