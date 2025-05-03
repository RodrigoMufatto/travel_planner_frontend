"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { loadGoogleMapsApi } from "@/utils/load-google";

interface RestaurantSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  onSelectRestaurant: (restaurant: any) => void;
}

export default function RestaurantSearchModal({
  isOpen,
  onClose,
  destination,
  onSelectRestaurant,
}: RestaurantSearchModalProps) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [paginationFunc, setPaginationFunc] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRestaurants([]);
      fetchRestaurants();
    }
  }, [isOpen]);

  async function fetchRestaurants() {
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
      type: "restaurant",
      query: `${destination.city} restaurant`,
    };

    service.textSearch(request, (results, status, pagination) => {
      setLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        let filtered = results;
        if (selectedRating !== null) {
          filtered = filtered.filter((r) => (r.rating ?? 0) >= selectedRating);
        }
        if (selectedPrice !== null) {
          filtered = filtered.filter((r) => r.price_level === selectedPrice);
        }
        setRestaurants((prev) => [...prev, ...filtered]);

        if (pagination?.hasNextPage) {
          setPaginationFunc(() => () => pagination.nextPage());
        } else {
          setPaginationFunc(null);
        }
      } else {
        setRestaurants([]);
        console.error("Error searching for restaurants", status);
      }
    });
  }

  return isOpen ? (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 z-10 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Buscar Restaurantes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="sticky top-[72px] bg-white z-10 px-6 py-2 border-b flex gap-2">
          <select
            className="text-sm border rounded px-2 py-1 text-gray-600"
            onChange={(e) => setSelectedRating(Number(e.target.value) || null)}
          >
            <option value="">Classificação</option>
            <option value="4">4.0+ ⭐</option>
            <option value="3">3.0+ ⭐</option>
            <option value="2">2.0+ ⭐</option>
          </select>
          <select
            className="text-sm border rounded px-2 py-1 text-gray-600"
            onChange={(e) => setSelectedPrice(Number(e.target.value) || null)}
          >
            <option value="">Ranking de preço</option>
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
            <option value="4">$$$$</option>
          </select>
          <button
            onClick={() => {
              setRestaurants([]);
              fetchRestaurants();
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded"
          >
            Buscar
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando restaurantes...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {restaurants.map((r) => (
                <button
                  key={r.place_id}
                  onClick={() => {
                    onSelectRestaurant(r);
                    onClose();
                  }}
                  className="border rounded-lg p-4 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex gap-3 items-center">
                    {r.photos?.[0] && (
                      <Image
                        src={r.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })}
                        alt={r.name}
                        width={100}
                        height={100}
                        className="rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{r.name}</p>
                      <p className="text-sm text-gray-400">{r.formatted_address}</p>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        {r.rating !== undefined && <span className="text-yellow-600">{r.rating} ★</span>}
                        {r.price_level !== undefined && (
                          <span className="text-gray-400">
                            {"$".repeat(r.price_level)}
                          </span>
                        )}
                      </div>
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
  ) : null;
}
