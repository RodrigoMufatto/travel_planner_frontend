"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateActivity,
  useTripById,
  useActivitiesByDestination,
  useCreateHotel,
  useHotelsByDestination,
  useDeleteHotel,
  useCreateRestaurant,
  useRestaurantsByDestination,
  useDeleteRestaurant,
  useCreateFlight,
  useFlightsByDestination,
  useDeleteFlight,
} from "@/api/trip/queries/trip-queries";
import {
  Calendar,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NewActivityModal from "@/components/new-activity-modal";
import HotelSearchModal from "@/components/hotel-search-modal";
import RestaurantSearchModal from "@/components/restaurant-search-modal";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import FlightSearchModal from "@/components/flight-search-modal ";
import FlightSection from "@/components/flight-section";
import RestaurantSection from "@/components/restaurant-section";
import HotelSection from "@/components/hotel-section";
import { Activity } from "@/api/trip/interfaces/list-activity.interface";
import { TripDestination } from "@/api/trip/interfaces/get-trip-by-id.interface";
import { CreateActivityPayload } from "@/api/trip/interfaces/create-activity.interface";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
interface ActivityFormInput {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  timezoneOffset?: string;
  cost?: string;
  locationDetails?: {
    city?: string;
    state?: string;
    country?: string;
    number?: string;
    neighborhood?: string;
    street?: string;
    zipcode?: string;
  };
}

export default function TripManagementPage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const createActivityMutation = useCreateActivity(token || "");
  const createHotelMutation = useCreateHotel(token || "");
  const createRestaurantMutation = useCreateRestaurant(token || "");
  const createFlightMutation = useCreateFlight(token || "");
  const [selectedTab, setSelectedTab] = useState(0);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [hotelPage, setHotelPage] = useState(1);
  const [restaurantPage, setRestaurantPage] = useState(1);
  const [flightPage, setFlightPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data: trip,
    isLoading,
    isError,
  } = useTripById(tripId as string, token || "");

  const selectedDestination = trip?.destinations[selectedTab];

  const deleteHotelMutation = useDeleteHotel(token ?? "", selectedDestination?.id ?? "");
  const deleteRestaurantMutation = useDeleteRestaurant(token ?? "", selectedDestination?.id ?? "");
  const deleteFlightMutation = useDeleteFlight(token ?? "", selectedDestination?.id ?? "");

  const {
    data: activityData,
    isLoading: loadingActivities,
  } = useActivitiesByDestination(selectedDestination?.id ?? null, token || "", activityPage);

  const {
    data: hotelData,
    isLoading: loadingHotels,
  } = useHotelsByDestination(selectedDestination?.id || null, token || null, hotelPage);

  const {
    data: restaurantData,
    isLoading: loadingRestaurants,
  } = useRestaurantsByDestination(selectedDestination?.id || null, token || null, restaurantPage);

  const {
    data: flightData,
    isLoading: loadingFlights,
  } = useFlightsByDestination(selectedDestination?.id || null, token || null, flightPage);

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
        {trip.destinations.map((d: TripDestination, index: number) => (
          <button
            key={index}
            onClick={() => {
              setSelectedTab(index);
              setActivityPage(1);
              setHotelPage(1);
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
                Atividades em {selectedDestination?.city ?? "?"}, {selectedDestination?.country ?? "?"}
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
                  {activityData?.activity?.map((a: Activity) => (
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
                  {activityData?.pagination && (
                    <div className="flex justify-center items-center gap-2 pt-4">
                      <button
                        onClick={() => setActivityPage((prev) => Math.max(prev - 1, 1))}
                        disabled={activityPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} className="text-gray-600" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {activityPage} de {activityData.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setActivityPage((prev) => Math.min(prev + 1, activityData.pagination.totalPages))}
                        disabled={activityPage === activityData.pagination.totalPages}
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
            {/* Flight section */}
            <FlightSection
              flights={flightData?.flights ?? null}
              isLoading={loadingFlights}
              page={flightPage}
              setPage={setFlightPage}
              pagination={flightData?.pagination ?? null}
              onAdd={() => setShowFlightModal(true)}
              onDelete={(id) => deleteFlightMutation.mutate(id)}
            />

            {/* Hotel section */}
            <HotelSection
              hotels={hotelData?.hotel || []}
              isLoading={loadingHotels}
              page={hotelPage}
              setPage={setHotelPage}
              pagination={hotelData?.pagination}
              onAdd={() => setShowHotelModal(true)}
              onDelete={(id) => deleteHotelMutation.mutate(id)}
            />

            {/* Restaurant section */}
            <RestaurantSection
              restaurants={
                (restaurantData?.restaurant ?? []).map((r) => ({
                  ...r,
                  rating: r.rating.toString(),
                }))
              }
              isLoading={loadingRestaurants}
              page={restaurantPage}
              setPage={setRestaurantPage}
              pagination={restaurantData?.pagination}
              onAdd={() => setShowRestaurantModal(true)}
              onDelete={(id) => deleteRestaurantMutation.mutate(id)}
            />
          </div>
        </div>
      </div>

      {selectedDestination && (
        <HotelSearchModal
          isOpen={showHotelModal}
          onClose={() => setShowHotelModal(false)}
          destination={{
            city: selectedDestination.city,
            country: selectedDestination.country,
            latitude: selectedDestination.latitude ?? "0",
            longitude: selectedDestination.longitude ?? "0",
          }}
          onSelectHotel={async (hotel) => {
            try {
              const mapDiv = document.createElement("div");
              const service = new google.maps.places.PlacesService(mapDiv);

              service.getDetails({ placeId: hotel.place_id }, async (details, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !details) {
                  console.error("Error retrieving hotel details");
                  return;
                }

                const components = details.address_components || [];

                const getComponent = (type: string) =>
                  components.find((c) => c.types.includes(type))?.long_name || "";

                const street = getComponent("route") || hotel.name;
                const number = getComponent("street_number");
                const neighborhood =
                  getComponent("sublocality") ||
                  getComponent("sublocality_level_1") ||
                  getComponent("neighborhood");
                const state =
                  getComponent("administrative_area_level_1") || selectedDestination.state || "";
                const zipcode = getComponent("postal_code");

                const payload = {
                  destinationId: selectedDestination.id,
                  name: hotel.name,
                  rating: hotel.rating?.toString() || "",
                  address: {
                    city: selectedDestination.city,
                    state,
                    country: selectedDestination.country,
                    number,
                    neighborhood,
                    street,
                    zipcode,
                  },
                };

                await createHotelMutation.mutateAsync(payload);
                await queryClient.invalidateQueries({
                  queryKey: ["hotels-by-destination", selectedDestination.id],
                });
                setShowHotelModal(false);
              });
            } catch (err) {
              console.error("Error saving hotel:", err);
            }
          }}
        />
      )}

      {selectedDestination && (
        <RestaurantSearchModal
          isOpen={showRestaurantModal}
          onClose={() => setShowRestaurantModal(false)}
          destination={{
            city: selectedDestination.city,
            country: selectedDestination.country,
            latitude: selectedDestination.latitude ?? "0",
            longitude: selectedDestination.longitude ?? "0",
          }}
          onSelectRestaurant={async (restaurant) => {
            try {
              const mapDiv = document.createElement("div");
              const service = new google.maps.places.PlacesService(mapDiv);

              service.getDetails({ placeId: restaurant.place_id }, async (details, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !details) return;

                const components = details.address_components || [];

                const getComponent = (type: string) =>
                  components.find((c) => c.types.includes(type))?.long_name || "";

                const street = getComponent("route") || restaurant.name;
                const number = getComponent("street_number");
                const neighborhood =
                  getComponent("sublocality") ||
                  getComponent("sublocality_level_1") ||
                  getComponent("neighborhood");
                const state =
                  getComponent("administrative_area_level_1") || selectedDestination.state || "";
                const zipcode = getComponent("postal_code");

                const payload = {
                  destinationId: selectedDestination.id,
                  name: restaurant.name,
                  rating: restaurant.rating?.toString() || "",
                  priceLevel: typeof restaurant.price_level === "number" ? restaurant.price_level : 0,
                  address: {
                    city: selectedDestination.city,
                    state,
                    country: selectedDestination.country,
                    number,
                    neighborhood,
                    street,
                    zipcode,
                  },
                };

                await createRestaurantMutation.mutateAsync(payload);

                await queryClient.invalidateQueries({
                  queryKey: ["restaurants-by-destination", selectedDestination.id],
                });

                setShowRestaurantModal(false);
              });
            } catch (err) {
              console.error("Erro ao salvar restaurante:", err);
            }
          }}
        />
      )}

      {selectedDestination && (
        <FlightSearchModal
          isOpen={showFlightModal}
          onClose={() => setShowFlightModal(false)}
          onSelectFlight={async (flight) => {
            const destination = selectedDestination;

            const payload = {
              destinationId: destination.id,
              stopNumber: flight.stops,
              nonStop: flight.stops === 0,
              duration: "",
              price: flight.price,
              flights: flight.segments.map((segment, index) => ({
                airlineName: flight.airlineName || flight.airline,
                carrierCodeAirline: segment.carrierCode || flight.airline,
                originAirport: segment.departure.iataCode,
                destinationAirport: segment.arrival.iataCode,
                departureDate: segment.departure.at.split("T")[0],
                departureTime: segment.departure.at,
                arrivalDate: segment.arrival.at.split("T")[0],
                arrivalTime: segment.arrival.at,
                order: index + 1,
              })),
            };

            try {
              await createFlightMutation.mutateAsync(payload);
              await queryClient.invalidateQueries({
                queryKey: ["flights-by-destination", destination.id],
              });
            } catch (err) {
              console.error("Erro ao salvar voo:", err);
            }
          }}
        />
      )}

      {showActivityModal && (
        <NewActivityModal
          onClose={() => setShowActivityModal(false)}
          onSubmit={async (activity: ActivityFormInput) => {
            try {
              const destination = trip.destinations[selectedTab];
              const timezoneOffset = parseFloat(activity.timezoneOffset || "0");
              const startLocal = new Date(`${activity.date}T${activity.startTime}:00`);
              const endLocal = new Date(`${activity.date}T${activity.endTime}:00`);
              const startDate = new Date(startLocal.getTime() - timezoneOffset * 60 * 60 * 1000 * -1).toISOString();
              const endDate = new Date(endLocal.getTime() - timezoneOffset * 60 * 60 * 1000 * -1).toISOString();
          
              const payload: CreateActivityPayload = {
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
              console.error("Error creating activity:", err);
            }
          }}
          initialLat={parseFloat(trip.destinations[selectedTab].latitude || "")}
          initialLng={parseFloat(trip.destinations[selectedTab].longitude || "")}
        />
      )}
    </div>
  );
}