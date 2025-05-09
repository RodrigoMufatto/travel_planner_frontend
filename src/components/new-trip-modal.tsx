"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2, MapPin, Calendar } from "lucide-react";
import { loadGoogleMapsApi } from "@/utils/load-google";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-autocomplete";

export default function NewTripModal({
  userId,
  onClose,
  onSubmit,
}: {
  userId: string;
  onClose: () => void;
  onSubmit: (tripData: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [destinations, setDestinations] = useState([
    {
      city: "",
      startDate: "",
      endDate: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
      placeId: "",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCityQuery, setActiveCityQuery] = useState<string>("");
  const { results } = useGooglePlacesAutocomplete(activeCityQuery);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeIndex !== null &&
        dropdownRefs.current[activeIndex] &&
        !dropdownRefs.current[activeIndex]?.contains(event.target as Node)
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeIndex]);

  const handleDestinationChange = (
    index: number,
    field: keyof typeof destinations[0],
    value: string
  ) => {
    const updated = [...destinations];
    updated[index][field] = value;
    setDestinations(updated);

    if (field === "city") {
      setActiveIndex(index);
      setActiveCityQuery(value);
    }
  };

  const handleSelectCity = async (index: number, placeId: string, description: string) => {
    const map = document.createElement("div");
    await loadGoogleMapsApi();

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId,
        fields: ["address_components", "geometry"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;

        const getComponent = (type: string) =>
          place.address_components?.find((comp) => comp.types.includes(type))?.long_name || "";

        const updated = [...destinations];
        updated[index] = {
          city: getComponent("locality") || getComponent("administrative_area_level_2") || description,
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          latitude: place.geometry?.location?.lat().toString() || "",
          longitude: place.geometry?.location?.lng().toString() || "",
          placeId,
          startDate: updated[index].startDate,
          endDate: updated[index].endDate,
        };
        setDestinations(updated);
        setActiveIndex(null);
      }
    );
  };

  const addDestination = () => {
    setDestinations((prev) => [
      ...prev,
      {
        city: "",
        startDate: "",
        endDate: "",
        state: "",
        country: "",
        latitude: "",
        longitude: "",
        placeId: "",
      },
    ]);
  };

  const removeDestination = (index: number) => {
    setDestinations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    const isValid =
      title.trim() &&
      destinations.every((dest) => dest.city.trim() && dest.startDate && dest.endDate);

    if (!isValid) {
      alert("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    const tripData = {
      title,
      userTrips: { userId },
      destination: destinations.map((dest) => ({
        city: dest.city,
        startDate: new Date(dest.startDate).toISOString(),
        endDate: new Date(dest.endDate).toISOString(),
        state: dest.state,
        country: dest.country,
        latitude: dest.latitude,
        longitude: dest.longitude,
        placeId: dest.placeId,
      })),
    };

    onSubmit(tripData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-gray-900 font-semibold mb-4">Criar nova viagem</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da viagem"
          className="w-full mb-4 px-4 py-2 border text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring"
        />

        <h3 className="text-sm font-medium text-gray-900 mb-2">Destinos</h3>

        <div className="space-y-4 bg-gray-50 p-4 rounded-md mb-6 text-gray-400">
          {destinations.map((dest, index) => (
            <div key={index} className="space-y-3">
              <div
                className="flex items-center gap-2 relative"
                ref={(el) => {
                  dropdownRefs.current[index] = el;
                }}
              >
                <label className="flex flex-1 items-center gap-2 text-sm relative">
                  <MapPin size={14} />
                  <input
                    type="text"
                    placeholder="Destino"
                    value={dest.city}
                    onChange={(e) => handleDestinationChange(index, "city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    onFocus={() => {
                      setActiveIndex(index);
                      setActiveCityQuery(dest.city);
                    }}
                  />
                  {activeIndex === index && results.length > 0 && dest.city.length > 1 && (
                    <div className="absolute top-full left-6 right-0 bg-white border rounded-md shadow-md mt-1 z-50 max-h-48 overflow-y-auto text-gray-700">
                      {results.map((suggestion, i) => (
                        <button
                          key={suggestion.placeId + i}
                          onClick={() => handleSelectCity(index, suggestion.placeId, suggestion.description)}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          {suggestion.description}
                        </button>
                      ))}
                    </div>
                  )}
                </label>

                {destinations.length > 1 && (
                  <button
                    onClick={() => removeDestination(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <Calendar size={14} />
                  <input
                    type="date"
                    value={dest.startDate}
                    onChange={(e) => handleDestinationChange(index, "startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Calendar size={14} />
                  <input
                    type="date"
                    value={dest.endDate}
                    onChange={(e) => handleDestinationChange(index, "endDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addDestination}
            className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
          >
            <Plus size={14} />
            Add destino
          </button>
        </div>

        <button
          onClick={handleCreate}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Criar viagem
        </button>
      </div>
    </div>
  );
}
