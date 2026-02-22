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
  slug?: string;
  title: string;
  description?: string;
  eventDate: string;
  venueName?: string;
  venueAddress?: string;
  googleMapsLink?: string;

  cover?: CoverImage;

  displayPoster?: SanityImage;

  language?: string;
  duration?: string;
  ticketsNeededFor?: string;
  entryAllowedFor?: string;
  layout?: string;
  seatingArrangement?: string;
  kidFriendly?: boolean;
  petFriendly?: boolean;

  artists?: Artist[];

  ticketTypes?: {
    name: string;
    price: number;
    capacity: number;
    description?: string;
  }[];

  termsAndConditions?: string;
}