export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
export interface Attachment {
  id: string;
  width?: number;
  height?: number;
  url: string;
  filename: string;
  type: string;
  size: number;
  thumbnails?: {
    small: Thumbnail;
    large: Thumbnail;
    full: Thumbnail;
  };
}

export interface Media {
  id: string;
  url?: string;
  lieux?: string[];
  nom: string;
  credits: string;
  fichiers?: Attachment[];
}
