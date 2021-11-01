import React, { useState } from "react";
import { useGetList } from "../hooks/useAPI";
import { NewsType } from "../types";
import { LinkPreview } from "./link-preview";
import { Media } from "./media/media";

const headerTitle = (type: "lieux" | "selections" | "parcours") => {
  switch (type) {
    case "lieux":
      return "le lieu";
    case "parcours":
      return "le parcours";
    case "selections":
      return "la sélection de";
  }
};

const NewsItem: React.FC<{ news: NewsType }> = ({ news }) => (
  <LinkPreview className="d-flex flex-column news" to={`/${news.type}/${news.id}`}>
    <div className="rightHeader">Découvrez {headerTitle(news.type)}</div>

    <Media media={news.cover_media} cover />
    <div className="info-box">
      <div className="title">{news.title}</div>
      <div className="subtitle">{news.subtitle}</div>
    </div>
  </LinkPreview>
);

export const NewsCarousel: React.FC<{}> = () => {
  const [news, loading] = useGetList<NewsType>("news");
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  return (
    <>
      {!loading && news && (
        <div id="news-carousel" className="carousel slide ">
          <div className="carousel-inner">
            {news?.map((n, i) => (
              <div className={`carousel-item ${i === carouselIndex ? "active" : ""}`}>
                <NewsItem key={n.id} news={n} />
              </div>
            ))}
          </div>
          <div className="carousel-controls d-flex justify-content-between">
            {" "}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#news-carousel"
              onClick={() => setCarouselIndex(carouselIndex !== 0 ? carouselIndex - 1 : news.length - 1)}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <div className="carousel-indicators">
              {news?.map((n, i) => (
                <button
                  type="button"
                  onClick={() => setCarouselIndex(i)}
                  className={`${i === carouselIndex ? "active" : ""}`}
                  data-bs-target="#news-carousel"
                  aria-current={i === carouselIndex}
                  aria-label={`Nouveauté ${i + 1}`}
                ></button>
              ))}
            </div>
            <button
              className="carousel-control-next"
              data-bs-target="#news-carousel"
              onClick={() => setCarouselIndex(carouselIndex !== news.length - 1 ? carouselIndex + 1 : 0)}
              type="button"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
