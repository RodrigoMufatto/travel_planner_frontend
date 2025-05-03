"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateActivity,
  useTripById,
  useActivitiesByDestination,
} from "@/api/trip/queries/trip-queries";
import {
  Calendar,
  Hotel,
  MapPin,
  PlaneTakeoff,
  Plus,
  Utensils,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NewActivityModal from "@/components/new-activity-modal";
import HotelSearchModal from "@/components/hotel-search-modal";
import RestaurantSearchModal from "@/components/restaurant-search-modal";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import FlightSearchModal from "@/components/flight-search-modal ";

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
  const createActivityMutation = useCreateActivity(token || "");
  const [selectedTab, setSelectedTab] = useState(0);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data: trip,
    isLoading,
    isError,
  } = useTripById(tripId as string, token || "");

  const selectedDestination = trip?.destinations[selectedTab];

  const {
    data: activityData,
    isLoading: loadingActivities,
  } = useActivitiesByDestination(selectedDestination?.id, token || "", page);

  if (isLoading) return <p className="p-6">Carregando...</p>;
  if (isError || !trip) return <p className="p-6">Erro ao carregar dados da viagem.</p>;

  const start = formatDate(trip.destinations[0].startDate);
  const end = formatDate(trip.destinations[trip.destinations.length - 1].endDate);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b w-full">
        <div className="mx-auto px-6 xl:px-28 py-4">
          <h1 className="text-lg font-semibold text-gray-900">{trip.title}</h1>
          <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
            <MapPin size={14} />
            <span>{trip.destinations.length} destinos</span>
            <Calendar size={14} className="ml-4" />
            <span>
              {start} - {end}
            </span>
          </div>
        </div>
      </header>

      <div className="px-6 xl:px-28">
        <div className="py-4 flex gap-2 border-b">
          {trip.destinations.map((d: any, index: number) => (
            <button
              key={index}
              onClick={() => {
                setSelectedTab(index);
                setPage(1);
              }}
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

        <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Atividades em {selectedDestination.city}, {selectedDestination.country}
                </h2>
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="text-sm text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md flex items-center gap-1"
                >
                  <Plus size={14} /> Add atividade
                </button>
              </div>
              {loadingActivities ? (
                <p className="text-sm text-gray-500">Carregando atividades...</p>
              ) : activityData?.activity?.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-8">
                  Não possui atividades planejadas ainda
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
                    {activityData.activity.map((a: any) => (
                      <div key={a.id} className="border p-4 rounded-md bg-gray-50 shadow-sm relative">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{a.title}</h3>
                        <p className="text-xs text-gray-600 mb-1">{a.description}</p>
                        <p className="text-xs text-gray-500">
                          {formatInTimeZone(a.startDate, "UTC", "EEEE, dd 'de' MMMM", { locale: ptBR })}<br />
                          {formatInTimeZone(a.startDate, "UTC", "HH:mm")} - {formatInTimeZone(a.endDate, "UTC", "HH:mm")}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin size={12} className="text-gray-400" />
                          {a.address.street} {a.address.number}, {a.address.city}, {a.address.country}
                        </p>
                        {a.cost > 0 && (
                          <div className="absolute top-4 right-4">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 font-medium rounded-full">
                              R$ {a.cost.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {activityData.pagination && (
                    <div className="flex justify-center items-center gap-2 pt-4">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} className="text-gray-600" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {page} de {activityData.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, activityData.pagination.totalPages))}
                        disabled={page === activityData.pagination.totalPages}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} className="text-gray-600" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {[{
              icon: PlaneTakeoff,
              label: "Voos",
              action: () => setShowFlightModal(true),
            }, {
              icon: Hotel,
              label: "Hotéis",
              action: () => setShowHotelModal(true),
            }, {
              icon: Utensils,
              label: "Restaurantes",
              action: () => setShowRestaurantModal(true),
            }].map(({ icon: Icon, label, action }) => (
              <div key={label} className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-indigo-600" />
                    <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                  </div>
                  <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1" onClick={action}>
                    <Plus size={14} /> Add {label.toLowerCase()}
                  </button>
                </div>
                <div className="text-center text-sm text-gray-400 py-4">
                  Não possui {label.toLowerCase()} adicionados ainda
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HotelSearchModal
        isOpen={showHotelModal}
        onClose={() => setShowHotelModal(false)}
        destination={selectedDestination}
        onSelectHotel={(hotel) => {
          console.log("Hotel selecionado:", hotel);
        }}
      />

      <RestaurantSearchModal
        isOpen={showRestaurantModal}
        onClose={() => setShowRestaurantModal(false)}
        destination={selectedDestination}
        onSelectRestaurant={(restaurant) => {
          console.log("Restaurante selecionado:", restaurant);
        }}
      />

      <FlightSearchModal
        isOpen={showFlightModal}
        onClose={() => setShowFlightModal(false)}
        onSelectFlight={(flight) => {
          console.log("Voo selecionado:", flight);
        }}
      />

      {showActivityModal && (
        <NewActivityModal
          onClose={() => setShowActivityModal(false)}
          onSubmit={async (activity) => {
            try {
              const destination = trip.destinations[selectedTab];
              const timezoneOffset = parseFloat(activity.timezoneOffset || "0");
              const startLocal = new Date(`${activity.date}T${activity.startTime}:00`);
              const endLocal = new Date(`${activity.date}T${activity.endTime}:00`);
              const startDate = new Date(startLocal.getTime() - timezoneOffset * 60 * 60 * 1000 * -1).toISOString();
              const endDate = new Date(endLocal.getTime() - timezoneOffset * 60 * 60 * 1000 * -1).toISOString();
              const payload: any = {
                destinationId: destination.id,
                title: activity.title,
                description: activity.description,
                startDate,
                endDate,
                location: {
                  city: activity.locationDetails?.city || destination.city,
                  state: activity.locationDetails?.state || destination.state || "",
                  country: activity.locationDetails?.country || destination.country,
                  number: activity.locationDetails?.number || "",
                  neighborhood: activity.locationDetails?.neighborhood || "",
                  street: activity.locationDetails?.street || "",
                  zipcode: activity.locationDetails?.zipcode || "",
                },
              };
              if (activity.cost !== undefined && activity.cost !== "") {
                const parsedCost = parseFloat(activity.cost);
                if (!isNaN(parsedCost)) {
                  payload.cost = parsedCost;
                }
              }
              await createActivityMutation.mutateAsync(payload);
              await queryClient.invalidateQueries({
                queryKey: ["activities-by-destination", destination.id],
              });
              setShowActivityModal(false);
            } catch (err) {
              console.error("Erro ao criar atividade:", err);
            }
          }}
          initialLat={parseFloat(trip.destinations[selectedTab].latitude)}
          initialLng={parseFloat(trip.destinations[selectedTab].longitude)}
        />
      )}
    </div>
  );
}