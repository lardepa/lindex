export interface Dataset {
  lieux?: { [key: string]: LieuAirTable };
  professionnels?: { [key: string]: Professionnel };
  périodes?: { [key: string]: Periode };
  médias?: { [key: string]: MediaType };
  types_lieu?: { [key: string]: TypeLieu };
  sélections?: { [key: string]: Selection };
  distinctions?: { [key: string]: Distinction };
  parcours?: { [key: string]: ParcoursType };
}

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

export interface MediaType {
  id: string;
  url?: string;
  lieux?: string[];
  nom: string;
  credits: string;
  fichiers?: Attachment[];
}

export type Status = "En Rédaction" | "Publié";

interface LieuRoot {
  id: string;
  nom: string;
  adresse: string;
  status: Status;
  présentation: string;
  date: string; // approximate date not to be parsed as date
}

// complete version after foreign key completion
export interface LieuType extends LieuRoot {
  geolocalisation?: number[];
  maitre_oeuvre?: Professionnel;
  maitre_ouvrage?: Professionnel;
  périodes?: Periode[];
  médias?: MediaType[];
  cover_media?: MediaType;
  type: TypeLieu;
  distinctions?: Distinction[];
  // reverse keys
  sélections?: Selection[];
  parcours?: ParcoursType[];
}

// airtable version only includes ids as string
export interface LieuAirTable extends LieuRoot {
  geolocalisation: string; // lat,long as string
  maitre_oeuvre: string;
  maitre_ouvrage: string;
  périodes: string[];
  médias: string[];
  cover_media: string;
  type: string;
  distinctions: string[];
  // reverse keys
  sélections: string[];
  parcours: string[];
}

export interface Periode {
  id: string;
  nom: string;
  début: Date;
  fin: Date;
}

export interface Professionnel {
  id: string;
  nom: string;
  site_web: string;
}

export type DestinationType = "Logement" | "Équipement" | "Espace public";

export interface TypeLieu {
  id: string;
  type_destination: DestinationType;
  destination: string;
}
export interface Distinction {
  id: string;
  nom: string;
  description: string;
  logo: Attachment;
  site_web: string;
}
export interface Selection {
  id: string;
  invité: string;
  portrait?: Attachment;
  status: Status;
  introduction: string;
  édito: string;
  lieux: LieuRoot[];
}

interface ParcoursRoot {
  id: string;
  nom: string;
  édito: string;
  status: Status;
  date?: Date;
  expédition?: boolean;
}
export interface ParcoursAirtable extends ParcoursRoot {
  lieux: string[];
  cover_media?: string;
  médias?: string[];
}

export interface ParcoursType extends ParcoursRoot {
  lieux: LieuType[];
  cover_media?: MediaType;
  médias?: MediaType[];
}
