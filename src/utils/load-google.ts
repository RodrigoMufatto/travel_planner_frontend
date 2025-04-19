import { Loader } from "@googlemaps/js-api-loader";

let isLoaded = false;

export async function loadGoogleMapsApi() {
  if (isLoaded) return;

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
    language: "pt-BR",
    region: "BR",
  });

  await loader.load();
  isLoaded = true;
}
