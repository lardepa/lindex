import React, { useState } from "react";
import { GrDownload, GrDocumentPdf } from "react-icons/gr";
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
  forceRatio?: "force-height" | "force-width";
}
const _PDF: React.FC<PDFProps & SizeState> = ({ file, ratio, forceRatio, width, height }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  const pageSelectionHeight = 40;
  const availableHeight = height - pageSelectionHeight;
  const availableWidth = width - (window.scrollbars ? 2 : 0);
  let possibleSizes = [
    {
      width: availableWidth,
      height: availableWidth * (ratio || 1),
    },
    { height: availableHeight, width: availableHeight / (ratio || 1) },
  ].filter((ps) => ps.width <= availableWidth && ps.height <= availableHeight);

  possibleSizes = possibleSizes.filter((ps) => ps.width <= availableWidth && ps.height <= availableHeight);
  const realSize =
    possibleSizes.length === 1
      ? possibleSizes[0]
      : forceRatio === "force-width" || (!forceRatio && ratio && ratio <= 1)
      ? possibleSizes[0]
      : possibleSizes[1];

  const buttonStyle = { padding: "0.3rem" };
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center h-100 w-100`}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<PDFLoader width={realSize.width} height={realSize.height} />}
      >
        {numPages && numPages > 1 && (
          <div
            className="d-flex justify-content-center align-items-center p-1 position-relative"
            style={{ width: realSize.width, height: `${pageSelectionHeight}px` }}
          >
            <a href={file} rel="noreferrer" className="action" title="télécharger le PDF">
              <GrDocumentPdf />
              <GrDownload />
            </a>

            <button
              className="btn me-4"
              style={buttonStyle}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              &lt;
            </button>
            <span>
              <span>
                Page {pageNumber} sur {numPages}
              </span>
            </span>
            <button
              className="btn ms-4"
              style={buttonStyle}
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              &gt;
            </button>
          </div>
        )}
        <Page
          className="pdf-page"
          pageNumber={pageNumber}
          height={realSize.height}
          width={realSize.width}
          loading={<PDFLoader width={realSize.width} height={realSize.height} />}
        ></Page>
      </Document>
    </div>
  );
};
const PDF = withSize<PDFProps>(_PDF);
export default PDF;
