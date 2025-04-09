"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LucideMapPin, Plane, Search, Trash2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTrips, useCreateTrip } from "@/api/trip/queries/trip-queries";
import { deleteTrip } from "@/api/trip/service/trip-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NewTripModal from "@/components/new-trip-modal";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [expandedTrips, setExpandedTrips] = useState<Record<string, boolean>>({});
  const [searchText, setSearchText] = useState("");
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [showNewTripModal, setShowNewTripModal] = useState(false);

  const token = session?.user?.accessToken || null;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      const id = session?.user?.id;
      setUserId(id || null);
    }
  }, [status, session, router]);

  const { data, isLoading } = useTrips(userId, token, searchText);

  const deleteMutation = useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId, token!),
    onSuccess: () => {
      setTripToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["trips", userId, searchText] });
    },
  });

  const createTripMutation = useCreateTrip(token!, userId!);

  const handleCreateTrip = async (tripData: any) => {
    await createTripMutation.mutateAsync(tripData);
    setShowNewTripModal(false);
    queryClient.invalidateQueries({ queryKey: ["trips", userId, searchText] });
  };

  const toggleExpanded = (tripId: string) => {
    setExpandedTrips((prev) => ({
      ...prev,
      [tripId]: !prev[tripId],
    }));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white text-gray-900 flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Plane className="w-6 h-6 text-indigo-500" />
          Planejador de Viagens
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-gray-100 text-gray-700 px-4 py-1 rounded hover:bg-gray-200 text-sm font-medium flex items-center gap-1"
        >
          <LogOut size={14} />
          Sair
        </button>
      </header>

      {/* Campo de busca + botão nova viagem */}
      <section className="px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center bg-white rounded-md px-3 py-2 shadow-sm w-full max-w-md">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Procurar viagens..."
            className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowNewTripModal(true)}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
        >
          + Nova viagem
        </button>
      </section>

      {/* Cards */}
      <section className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          data?.trips.map((trip: any) => {
            const isExpanded = expandedTrips[trip.id];
            const shouldShowToggle = trip.destinations.length > 2;
            const destinationsToShow = isExpanded
              ? trip.destinations
              : trip.destinations.slice(0, 2);

            return (
              <div key={trip.id} className="bg-white rounded-xl shadow-md p-6 relative">
                <button
                  onClick={() => setTripToDelete(trip.id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>

                <h2 className="font-bold text-lg text-gray-900 mb-2">{trip.title}</h2>

                <div
                  className={`flex flex-col gap-3 ${
                    isExpanded ? "max-h-[120px] overflow-y-auto pr-2" : ""
                  }`}
                >
                  {destinationsToShow.map((dest: any) => (
                    <div key={dest.id} className="text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <LucideMapPin size={14} className="text-gray-600 flex-shrink-0" />
                        <span>{dest.city}, {dest.country}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-5">
                        De: {new Date(dest.startDate).toLocaleDateString("pt-BR")}
                        {" - "}
                        Até: {new Date(dest.endDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>

                {shouldShowToggle && (
                  <button
                    onClick={() => toggleExpanded(trip.id)}
                    className="text-indigo-600 hover:underline text-xs mt-2 ml-1"
                  >
                    {isExpanded ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Modal de confirmação */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Deletar viagem</h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setTripToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteMutation.mutate(tripToDelete)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nova viagem */}
      {showNewTripModal && (
        <NewTripModal
          userId={userId!}
          onClose={() => setShowNewTripModal(false)}
          onSubmit={handleCreateTrip}
        />
      )}
    </main>
  );
}
