import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";
import { SanityImage, CoverImage } from '../../type/event';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImage | CoverImage) {
  return builder.image(source);
}