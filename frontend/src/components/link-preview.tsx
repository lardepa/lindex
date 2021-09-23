import React from "react";
import { Link } from "react-router-dom";

export const previewURL = (url: string, preview: boolean): string => {
  const { pathname, searchParams } = new URL(url, process.env.PUBLIC_URL || "http://localhost");
  if (!url) return "";
  // normal mode leave url intact
  if (!preview) return url;
  // path to json data case
  else if (pathname.endsWith(".json")) {
    // add a preview suffix
    return `${pathname.split(".json")[0]}${preview ? "_preview" : ""}.json${searchParams ? `?${searchParams}` : ""}`;
  } else {
    // add a preview query param
    if (preview && searchParams.get("preview") !== "") {
      searchParams.append("preview", "");
    }
    if (!preview && searchParams.get("preview") === "") {
      searchParams.delete("preview");
    }

    return `${pathname}?${searchParams}`;
  }
};
interface LinkPreviewProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string; // | { pathname: string; search?: string; hash?: string; key?: string };
  replace?: boolean;
}

export const LinkPreview: React.FC<LinkPreviewProps> = (props) => {
  const { to } = props;

  return (
    <Link
      {...props}
      to={(location) => {
        const args = new URLSearchParams(location.search);
        const isPreview = args.get("preview") === "";

        return previewURL(to, isPreview);
      }}
    />
  );
};
