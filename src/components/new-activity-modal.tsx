"use client";

import { useEffect, useRef, useState } from "react";
import { X, Calendar, MapPin, Globe } from "lucide-react";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-autocomplete";
import LocationPickerModal from "./location-picker-modal";
import { getPlaceDetails } from "@/utils/get-place-details";

interface Props {
  onClose: () => void;
  onSubmit: (activity: any) => void;
  initialLat: number;
  initialLng: number;
}

export default function NewActivityModal({ onClose, onSubmit, initialLat, initialLng }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    locationDetails: {
      city: "",
      state: "",
      country: "",
      number: "",
      neighborhood: "",
      street: "",
      zipcode: "",
    },
    cost: "",
    timezoneOffset: "-3",
  });

  const [query, setQuery] = useState("");
  const { results } = useGooglePlacesAutocomplete(query);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "location") {
      setQuery(value);
    }
  };

  const handleSelectLocation = async (description: string, placeId: string) => {
    try {
      const locationDetails = await getPlaceDetails(placeId);
      setForm((prev) => ({
        ...prev,
        location: description,
        locationDetails,
      }));
    } catch (error) {
      console.error("Erro ao buscar detalhes do local:", error);
    }
    setQuery("");
  };

  const handleMapSelect = ({
    address,
    components,
  }: {
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
  }) => {
    setForm((prev) => ({
      ...prev,
      location: address,
      locationDetails: {
        city: components.city || "",
        state: components.state || "",
        country: components.country || "",
        number: components.number || "",
        neighborhood: components.neighborhood || "",
        street: components.street || "",
        zipcode: components.zipcode || "",
      },
    }));
    setShowMapModal(false);
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-400">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Criar atividade</h2>

        <div className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Título da atividade"
            className="w-full px-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="w-full px-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm resize-none"
          />
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              name="date"
              value={form.date}
              onChange={handleChange}
              type="date"
              className="w-full pl-9 pr-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm"
            />
          </div>

          <div className="relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="timezoneOffset"
              value={form.timezoneOffset}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm appearance-none bg-white"
            >
              <option value="0">UTC±00:00</option>
              <option value="-5">UTC-05:00 (Nova York)</option>
              <option value="-4">UTC-04:00 (Cuiabá)</option>
              <option value="-3">UTC-03:00 (Brasília)</option>
              <option value="1">UTC+01:00 (Lisboa)</option>
              <option value="3">UTC+03:00 (Moscou)</option>
              <option value="5.5">UTC+05:30 (Índia)</option>
              <option value="8">UTC+08:00 (Pequim)</option>
              <option value="10">UTC+10:00 (Sydney)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              type="time"
              className="w-full px-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm"
            />
            <input
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              type="time"
              className="w-full px-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              onFocus={() => setShowMapModal(true)}
              placeholder="Localização"
              className="w-full pl-9 pr-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm cursor-pointer"
              readOnly
            />
            {query.length > 1 && results.length > 0 && (
              <div className="absolute z-50 bg-white shadow-md border rounded-md mt-1 w-full max-h-48 overflow-y-auto text-sm text-gray-700">
                {results.map((r) => (
                  <button
                    key={r.placeId}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleSelectLocation(r.description, r.placeId)}
                  >
                    {r.description}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="Custo (opcional)"
            className="w-full px-3 py-2 border border-gray-800 text-gray-400 rounded-md text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-5 bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700"
        >
          Adicionar atividade
        </button>

        {showMapModal && (
          <LocationPickerModal
            initialLat={initialLat}
            initialLng={initialLng}
            onClose={() => setShowMapModal(false)}
            onSelect={handleMapSelect}
          />
        )}
      </div>
    </div>
  );
}
