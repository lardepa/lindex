import { flatten, identity, range } from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { MdNavigateNext, MdNavigateBefore, MdClose } from "react-icons/md";

import { MediaType } from "../../types";
import { Media } from "./media";

export const MediaGallery: FC<{ medias: MediaType[] }> = ({ medias }) => {
  const [fullscreenMediaIndex, setFullscreenMediaIndex] = useState<number | null>(null);
  const gallery = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (fullscreenMediaIndex !== null && gallery.current) {
      gallery.current.focus();
    }
  }, [fullscreenMediaIndex, gallery]);

  const flattenMedias = flatten(
    medias.map((m) => (m.fichiers ? m.fichiers.map((f) => ({ ...m, fichiers: [f] })) : m)),
  ).filter(identity) as MediaType[];

  return (
    <>
      {fullscreenMediaIndex !== null ? (
        <div
          ref={gallery}
          className="media-full-screen-gallery"
          tabIndex={0}
          onKeyDown={(e) => {
            console.log(e.code);
            if (e.code === "Escape") setFullscreenMediaIndex(null);
            if (e.code === "ArrowRight")
              setFullscreenMediaIndex(fullscreenMediaIndex < flattenMedias.length - 1 ? fullscreenMediaIndex + 1 : 0);
            if (e.code === "ArrowLeft")
              setFullscreenMediaIndex(fullscreenMediaIndex > 0 ? fullscreenMediaIndex - 1 : flattenMedias.length - 1);
          }}
        >
          <div className="w-100 h-100 position-relative d-flex justify-content-center align-items-center">
            <Media key={fullscreenMediaIndex} media={flattenMedias[fullscreenMediaIndex]} />
          </div>
          <button
            type="button"
            className="btn btn-icon position-absolute top-0 end-0"
            style={{ margin: "0.5rem" }}
            aria-label="Fermer"
            onClick={() => {
              setFullscreenMediaIndex(null);
            }}
          >
            <MdClose size={"2rem"} />
          </button>
          <button
            type="button"
            className="btn btn-icon position-absolute top-50 end-0"
            aria-label="Suivant"
            onClick={() => {
              setFullscreenMediaIndex(fullscreenMediaIndex < flattenMedias.length - 1 ? fullscreenMediaIndex + 1 : 0);
            }}
          >
            <MdNavigateNext size={"2rem"} />
          </button>
          <button
            type="button"
            className="btn btn-icon  position-absolute top-50 start-0"
            aria-label="Précédent"
            onClick={() => {
              setFullscreenMediaIndex(fullscreenMediaIndex > 0 ? fullscreenMediaIndex - 1 : flattenMedias.length - 1);
            }}
          >
            <MdNavigateBefore size={"2rem"} />
          </button>
          <ul className="gallery-pages">
            {range(0, flattenMedias.length).map((i) => (
              <li
                key={i}
                className={`${i === fullscreenMediaIndex ? "active" : ""}`}
                onClick={() => setFullscreenMediaIndex(i)}
              />
            ))}
          </ul>
        </div>
      ) : (
        flattenMedias.map((media, i) => (
          <Media
            media={media}
            cover
            key={i}
            onClick={() => {
              setFullscreenMediaIndex(i);
            }}
          />
        ))
      )}
    </>
  );
};
