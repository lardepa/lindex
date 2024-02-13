import { flatten, identity, range } from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { MdClose, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

import { MediaType } from "../../types";
import { Media } from "./media";

const getFullScreenMEdiaSizes = (media: MediaType): string | undefined => {
  const file = media.fichiers && media.fichiers[0];
  if (file && file && file.width && file.height) {
    const orientation = file.width > file.height ? "landscape" : "portrait";

    // fullscreen with landscape image => use 100vw until the screen is wider than the image itself in which case we don't oversize the image
    // max-height does not work when setting width through sizes thus we add a media query on aspect ratio to cover this case.
    if (orientation === "landscape")
      return `(max-width: ${file.width}px) and (max-aspect-ratio: ${file.height / file.width}px) 100vw,(max-width: ${file.width}px) calc(100vh * ${file.width / file.height}),${file.width}px`;
    else {
      // fullscreen with portrait image => we adapt width to the screen height until the screen is higher than the image itself in which case we don't oversize the image
      return `(max-height: ${file.height}px) calc(100vh * ${file.width / file.height}), ${file.width}px`;
    }
  }
  return undefined;
};

export const MediaGallery: FC<{ medias: MediaType[]; sizes?: string }> = ({ medias, sizes }) => {
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

  const fullscreenMedia = fullscreenMediaIndex !== null ? flattenMedias[fullscreenMediaIndex] : null;
  return (
    <>
      {fullscreenMediaIndex !== null && fullscreenMedia ? (
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
            <Media
              key={fullscreenMediaIndex}
              media={fullscreenMedia}
              sizes={getFullScreenMEdiaSizes(fullscreenMedia)}
            />
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
            sizes={sizes}
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
