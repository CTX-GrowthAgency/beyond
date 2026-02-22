import { createClient } from "next-sanity";

const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b20vk6g9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
};

console.log("Sanity client config:", clientConfig);

export const sanityClient = createClient(clientConfig);