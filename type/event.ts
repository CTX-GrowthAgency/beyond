export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface CoverImage {
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface Artist {
  name: string;
  role?: string;
  instagram?: string;
  image?: SanityImage;
}

export interface TicketType {
  name: string;
  price: number;
  capacity?: number;
  description?: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  eventDate: Date;
  venueName?: string;
  venueAddress?: string;
  googleMapsLink?: string;

  cover?: CoverImage;

  displayPoster?: SanityImage;

  language?: string;
  duration?: string;
  ageLimit?: string;

  artists?: Artist[];

  ticketTypes?: {
    name: string;
    price: number;
    capacity: number;
    description?: string;
  }[];
}