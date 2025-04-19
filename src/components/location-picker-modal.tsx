"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { loadGoogleMapsApi } from "@/utils/load-google";

interface Props {
  onClose: () => void;
  onSelect: (data: {
    lat: number;
    lng: number;
    address: string;
    components: {
      street?: string;
      number?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      country?: string;
      zipcode?: string;
    };
  }) => void;
  initialLat: number;
  initialLng: number;
}

export default function LocationPickerModal({ onClose, onSelect, initialLat, initialLng }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<{ lat: number; lng: number }>({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState<string>("");
  const [components, setComponents] = useState<any>({});

  useEffect(() => {
    let map: google.maps.Map;
    let marker: google.maps.Marker;

    const initMap = async () => {
      await loadGoogleMapsApi();

      map = new google.maps.Map(mapRef.current!, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 14,
      });

      marker = new google.maps.Marker({
        position: { lat: initialLat, lng: initialLng },
        map,
        draggable: true,
      });

      const geocoder = new google.maps.Geocoder();
      const updateAddress = (position: google.maps.LatLngLiteral) => {
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            const result = results[0];
            const comps = result.address_components.reduce((acc, comp) => {
              if (comp.types.includes("route")) acc.street = comp.long_name;
              if (comp.types.includes("street_number")) acc.number = comp.long_name;
              if (comp.types.includes("sublocality") || comp.types.includes("sublocality_level_1")) acc.neighborhood = comp.long_name;
              if (comp.types.includes("administrative_area_level_2")) acc.city = comp.long_name;
              if (comp.types.includes("administrative_area_level_1")) acc.state = comp.short_name;
              if (comp.types.includes("country")) acc.country = comp.long_name;
              if (comp.types.includes("postal_code")) acc.zipcode = comp.long_name;
              return acc;
            }, {} as any);

            setAddress(result.formatted_address);
            setComponents(comps);
          } else {
            setAddress("Localização selecionada");
            setComponents({});
          }
        });
      };

      updateAddress({ lat: initialLat, lng: initialLng });

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng!.toJSON();
        marker.setPosition(latLng);
        setSelected(latLng);
        updateAddress(latLng);
      });

      marker.addListener("dragend", () => {
        const latLng = marker.getPosition()!.toJSON();
        setSelected(latLng);
        updateAddress(latLng);
      });

      // Adiciona autocomplete
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
        types: ["geocode"],
      });
      autocomplete.bindTo("bounds", map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        map.setCenter(position);
        marker.setPosition(position);
        setSelected(position);
        updateAddress(position);
      });
    };

    initMap();
  }, [initialLat, initialLng]);

  const handleConfirm = () => {
    if (selected && address) {
      onSelect({ ...selected, address, components });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-4 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Selecione um local</h2>

        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar local..."
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-400"
        />

        <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden mb-4" />

        {address && (
          <div className="text-sm text-gray-700 mb-4">
            <strong>Local selecionado:</strong> {address}
          </div>
        )}

        <button
          onClick={handleConfirm}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Confirmar localização
        </button>
      </div>
    </div>
  );
}
