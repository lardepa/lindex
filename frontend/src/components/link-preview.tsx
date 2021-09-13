import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryParamsState } from "../hooks/queryParams";

export const previewURL = (url: string, preview: boolean): string => {
  if (!url) return "";
  // normal mode leave url intact
  if (!preview) return url;
  // path to json data case
  else if (url.endsWith(".json")) {
    // add a preview suffix
    return `${url.split(".json")[0]}${preview ? "_preview" : ""}.json`;
  } else {
    // add a preview query param

    // todo: will fail if there is a escaped ? in param value
    // todo: will fail is preveiw already in params
    if (url.includes("?") && !url.split("?")[1].includes("preview")) return `${url}&preview`;
    else return `${url}?preview`;
  }
};
interface LinkPreviewProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const LinkPreview: React.FC<LinkPreviewProps> = (props) => {
  const [{ isPreview }] = useQueryParamsState();
  const [previewTo, setPreviewTo] = useState<string>(previewURL(props.to, isPreview));

  useEffect(() => setPreviewTo(previewURL(props.to, isPreview)), [isPreview, props.to]);
  return <Link {...props} to={previewTo} />;
};
