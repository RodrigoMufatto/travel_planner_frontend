"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { loadGoogleMapsApi } from "@/utils/load-google";

interface HotelSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  onSelectHotel: (hotel: any) => void;
}

export default function HotelSearchModal({
  isOpen,
  onClose,
  destination,
  onSelectHotel,
}: HotelSearchModalProps) {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [paginationFunc, setPaginationFunc] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHotels([]);
      fetchHotels();
    }
  }, [isOpen]);

  async function fetchHotels() {
    setLoading(true);
    await loadGoogleMapsApi();

    const mapDiv = document.createElement("div");
    const service = new google.maps.places.PlacesService(mapDiv);

    const request: google.maps.places.TextSearchRequest = {
      location: new google.maps.LatLng(
        parseFloat(destination.latitude),
        parseFloat(destination.longitude)
      ),
      radius: 50000,
      type: "lodging",
      query: `${destination.city} hotel`,
    };

    service.textSearch(request, (results, status, pagination) => {
      setLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        let filtered = results;
        if (selectedRating !== null) {
          filtered = filtered.filter((r) => (r.rating ?? 0) >= selectedRating);
        }
        setHotels((prev) => [...prev, ...filtered]);

        if (pagination?.hasNextPage) {
          setPaginationFunc(() => () => pagination.nextPage());
        } else {
          setPaginationFunc(null);
        }
      } else {
        setHotels([]);
        console.error("Error searching for hotels", status);
      }
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white p-6 z-10 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Buscar Hotéis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="sticky top-[72px] bg-white z-10 px-6 py-2 border-b flex flex-wrap gap-2">
          <select
            className="text-sm border rounded px-2 py-1 text-gray-600"
            onChange={(e) => setSelectedRating(Number(e.target.value) || null)}
          >
            <option value="">Classificação</option>
            <option value="4">4.0+ ⭐</option>
            <option value="3">3.0+ ⭐</option>
            <option value="2">2.0+ ⭐</option>
          </select>
          <button
            onClick={() => {
              setHotels([]);
              fetchHotels();
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded"
          >
            Buscar
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando hotéis...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {hotels.map((hotel) => (
                <button
                  key={hotel.place_id}
                  onClick={() => {
                    onSelectHotel(hotel);
                    onClose();
                  }}
                  className="border rounded-lg p-4 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex gap-3 items-center">
                    {hotel.photos?.[0] && (
                      <Image
                        src={hotel.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })}
                        alt={hotel.name}
                        width={100}
                        height={100}
                        className="rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{hotel.name}</p>
                      <p className="text-sm text-gray-400">{hotel.formatted_address}</p>
                      {hotel.rating && (
                        <p className="text-sm text-yellow-600">{hotel.rating} ★</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {paginationFunc && (
                <button
                  onClick={paginationFunc}
                  className="mt-4 text-sm text-indigo-600 hover:underline"
                >
                  Carregar mais
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}