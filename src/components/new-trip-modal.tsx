"use client";

import { useState } from "react";
import { X, Plus, Trash2, MapPin, Calendar } from "lucide-react";

export default function NewTripModal({ userId, onClose, onSubmit }: {
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
      placeId: ""
    }
  ]);

  const addDestination = () => {
    setDestinations([
      ...destinations,
      {
        city: "",
        startDate: "",
        endDate: "",
        state: "",
        country: "",
        latitude: "",
        longitude: "",
        placeId: ""
      }
    ]);
  };

  const removeDestination = (index: number) => {
    const updated = destinations.filter((_, i) => i !== index);
    setDestinations(updated);
  };

  const handleDestinationChange = (
    index: number,
    field: keyof typeof destinations[0],
    value: string
  ) => {
    const updated = [...destinations];
    updated[index][field] = value;
    setDestinations(updated);
  };

  const handleCreate = () => {
    const isValid = title.trim() && destinations.every(dest => 
      dest.city.trim() && dest.startDate && dest.endDate
    );

    if (!isValid) {
      alert("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    const tripData = {
      title,
      userTrips: { userId },
      destination: destinations.map(dest => ({
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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
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
              <div className="flex items-center gap-2">
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <MapPin size={14} />
                  <input
                    type="text"
                    placeholder="Destino"
                    value={dest.city}
                    onChange={(e) => handleDestinationChange(index, "city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
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