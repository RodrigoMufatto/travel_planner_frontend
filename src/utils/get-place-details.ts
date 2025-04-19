import { loadGoogleMapsApi } from "./load-google";

export async function getPlaceDetails(placeId: string): Promise<{
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}> {
  await loadGoogleMapsApi();

  const mapDiv = document.createElement("div");
  const service = new google.maps.places.PlacesService(mapDiv);

  return new Promise((resolve, reject) => {
    service.getDetails({ placeId }, (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
        return reject("Erro ao buscar detalhes do local.");
      }

      const components = place.address_components || [];

      const getComponent = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name || "";

      resolve({
        street: getComponent("route"),
        number: getComponent("street_number"),
        neighborhood:
          getComponent("sublocality") || getComponent("neighborhood"),
        city:
          getComponent("locality") || getComponent("administrative_area_level_2"),
        state: getComponent("administrative_area_level_1"),
        country: getComponent("country"),
        zipcode: getComponent("postal_code"),
      });
    });
  });
}
