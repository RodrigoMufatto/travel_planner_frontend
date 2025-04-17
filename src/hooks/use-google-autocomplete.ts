import { useEffect, useState } from "react";
import { loadGoogleMapsApi } from "@/utils/load-google";

type Suggestion = {
  description: string;
  placeId: string;
};

export function useGooglePlacesAutocomplete(input: string) {
  const [results, setResults] = useState<Suggestion[]>([]);

  useEffect(() => {
    let active = true;
    let service: google.maps.places.AutocompleteService;

    const fetchSuggestions = async () => {
      if (input.length < 2) return setResults([]);

      await loadGoogleMapsApi();
      service = new google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        {
          input,
          types: ["(cities)"],
        },
        (predictions) => {
          if (!active || !predictions) return;
          setResults(
            predictions.map((p) => ({
              description: p.description,
              placeId: p.place_id,
            }))
          );
        }
      );
    };

    fetchSuggestions();
    return () => {
      active = false;
    };
  }, [input]);

  return { results };
}
