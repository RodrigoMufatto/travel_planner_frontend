import { PlaneTakeoff, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";

type FlightSegment = {
  originAirport: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  airlineName: string;
};

type Flight = {
  id: string;
  price: number;
  flightInformation: FlightSegment[];
};

type Pagination = {
  totalPages: number;
};

interface FlightSectionProps {
  flights: Flight[] | null;
  isLoading: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pagination: Pagination | null;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function FlightSection({
  flights,
  isLoading,
  page,
  setPage,
  pagination,
  onAdd,
  onDelete,
}: FlightSectionProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <PlaneTakeoff size={16} className="text-indigo-600" />
          <h3 className="text-sm font-medium text-gray-900">Voos</h3>
        </div>
        <button
          className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
          onClick={onAdd}
        >
          <Plus size={14} /> Add voo
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-gray-400 py-4">Carregando voos...</div>
      ) : !flights || flights.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-4">Não possui voos adicionados ainda</div>
      ) : (
        <>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin max-h-[300px]">
            {flights.map((flight) => {
              const segments = flight.flightInformation;
              const firstSegment = segments[0];
              const lastSegment = segments[segments.length - 1];
              const route =
                segments.map((s) => s.originAirport).join(" → ") +
                " → " +
                lastSegment.destinationAirport;

              const departureTime = new Date(firstSegment.departureTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const arrivalTime = new Date(lastSegment.arrivalTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={flight.id}
                  className="border rounded-xl p-4 bg-gray-50 hover:shadow transition-shadow relative"
                >
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {firstSegment.airlineName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    R$ {flight.price.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {route} | {departureTime} - {arrivalTime}
                  </p>
                  {segments.length > 1 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Com escala - {segments.length - 1} parada{segments.length > 2 ? "s" : ""}
                    </p>
                  )}

                  <button
                    onClick={() => onDelete(flight.id)}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                    title="Remover voo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-gray-700"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={page === pagination.totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-gray-700"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
