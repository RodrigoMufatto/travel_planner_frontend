"use client";

import { useState } from "react";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Users,
  Baby,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react";

interface Flight {
  id: string;
  airline: string;
  price: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  stops: number;
  segments: { departure: { iataCode: string }; arrival: { iataCode: string } }[];
}

interface FlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFlight: (flight: Flight) => void;
}

export default function FlightSearchModal({
  isOpen,
  onClose,
  onSelectFlight,
}: FlightSearchModalProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [carriers, setCarriers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    maxPrice: "",
    nonStop: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/flights", {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate || undefined,
        adults: Number(searchParams.adults),
        children: Number(searchParams.children),
        maxPrice: searchParams.maxPrice || undefined,
        nonStop: searchParams.nonStop === "true",
      });
      setFlights(response.data.flights || []);
      setCarriers(response.data.carriers || {});
    } catch (error) {
      console.error("Error searching for flights:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-xl">
        <div className="sticky top-0 z-10 bg-white border-b px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Buscar Voos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="origin"
                value={searchParams.origin}
                onChange={handleChange}
                placeholder="Origem"
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="destination"
                value={searchParams.destination}
                onChange={handleChange}
                placeholder="Destino"
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="departureDate"
                value={searchParams.departureDate}
                onChange={handleChange}
                type="date"
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="returnDate"
                value={searchParams.returnDate}
                onChange={handleChange}
                type="date"
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="adults"
                value={searchParams.adults}
                onChange={handleChange}
                type="number"
                min={1}
                placeholder="Adultos"
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Baby className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="children"
                value={searchParams.children}
                onChange={handleChange}
                type="number"
                min={0}
                placeholder="Crianças"
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <ArrowRightLeft className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                name="nonStop"
                value={searchParams.nonStop}
                onChange={handleChange}
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              >
                <option value="">Conexão</option>
                <option value="true">Sem conexão</option>
                <option value="false">Com conexão</option>
              </select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="maxPrice"
                value={searchParams.maxPrice}
                onChange={handleChange}
                placeholder="Preço máximo"
                className="pl-9 pr-3 py-2 w-full text-sm text-gray-700 border border-gray-300 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end col-span-full">
              <button
                onClick={fetchFlights}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pt-4 pb-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando voos...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {flights.map((flight) => {
                const route = flight.segments
                  ? [
                      ...flight.segments.map((s) => s.departure.iataCode),
                      flight.segments[flight.segments.length - 1].arrival.iataCode,
                    ].join(" → ")
                  : `${flight.origin} → ${flight.destination}`;

                return (
                  <button
                    key={flight.id}
                    onClick={() => {
                      onSelectFlight(flight);
                      onClose();
                    }}
                    className="border rounded-xl p-4 text-left hover:bg-gray-50 transition"
                  >
                    <p className="font-medium text-gray-800">
                      {carriers[flight.airline] || flight.airline}
                    </p>
                    <p className="text-sm text-gray-500">
                      R$ {flight.price.toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {route} | {new Date(flight.departure).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} - {new Date(flight.arrival).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {flight.stops > 0 && (
                      <p className="text-xs text-gray-400">
                        Com escala - {flight.stops} parada{flight.stops > 1 ? "s" : ""}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}