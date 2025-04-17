"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTripById } from "@/api/trip/queries/trip-queries";
import {
  Calendar,
  Hotel,
  MapPin,
  PlaneTakeoff,
  Plus,
  Utensils,
} from "lucide-react";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function TripManagementPage() {
  const { tripId } = useParams();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    data: trip,
    isLoading,
    isError,
  } = useTripById(tripId as string, token || "");

  if (isLoading) return <p className="p-6">Carregando...</p>;
  if (isError || !trip) return <p className="p-6">Erro ao carregar dados da viagem.</p>;

  const start = formatDate(trip.destinations[0].startDate);
  const end = formatDate(trip.destinations[trip.destinations.length - 1].endDate);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">{trip.title}</h1>
        <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
          <MapPin size={14} />
          <span>{trip.destinations.length} destinos</span>
          <Calendar size={14} className="ml-4" />
          <span>{start} - {end}</span>
        </div>
      </header>

      {/* Destinations Tabs */}
      <div className="px-6 py-4 flex gap-2 bg-gray-100 border-b">
        {trip.destinations.map((d: any, index: number) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={`px-3 py-1 text-sm rounded-md border font-medium transition ${
              selectedTab === index
                ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {d.city}, {d.country}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Atividades em {trip.destinations[selectedTab].city}, {trip.destinations[selectedTab].country}
              </h2>
              <button className="text-sm text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md flex items-center gap-1">
                <Plus size={14} /> Add atividade
              </button>
            </div>
            <div className="text-center text-sm text-gray-400 py-8">
              Não possui atividades planejadas ainda
            </div>
          </div>
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-4">
          {/* Voos */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <PlaneTakeoff size={16} className="text-indigo-600" />
                <h3 className="text-sm font-medium text-gray-900">Voos</h3>
              </div>
              <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add voo
              </button>
            </div>
            <div className="text-center text-sm text-gray-400 py-4">
              Não possui voos adicionados ainda
            </div>
          </div>

          {/* Hotéis */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Hotel size={16} className="text-indigo-600" />
                <h3 className="text-sm font-medium text-gray-900">Hotéis</h3>
              </div>
              <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add hotel
              </button>
            </div>
            <div className="text-center text-sm text-gray-400 py-4">
              Não possui hotéis adicionados ainda
            </div>
          </div>

          {/* Restaurantes */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Utensils size={16} className="text-indigo-600" />
                <h3 className="text-sm font-medium text-gray-900">Restaurantes</h3>
              </div>
              <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add restaurante
              </button>
            </div>
            <div className="text-center text-sm text-gray-400 py-4">
              Não possui restaurantes adicionados ainda
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
