import { Hotel, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface HotelSectionProps {
  hotels: any[];
  isLoading: boolean;
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  pagination?: {
    totalPages: number;
  } | null;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function HotelSection({
  hotels,
  isLoading,
  page,
  setPage,
  pagination,
  onAdd,
  onDelete,
}: HotelSectionProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Hotel size={16} className="text-indigo-600" />
          <h3 className="text-sm font-medium text-gray-900">Hotéis</h3>
        </div>
        <button
          className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
          onClick={onAdd}
        >
          <Plus size={14} /> Add hotel
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-gray-400 py-4">Carregando hotéis...</div>
      ) : hotels.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-4">Não possui hotéis adicionados ainda</div>
      ) : (
        <>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin max-h-[300px]">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="border rounded-xl p-4 bg-gray-50 hover:shadow transition-shadow relative"
              >
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{hotel.name}</h4>
                <p className="text-sm text-gray-600 leading-tight break-words whitespace-normal">
                  {hotel.address.street} {hotel.address.number}{" "}
                  {hotel.address.neighborhood && hotel.address.neighborhood + ", "}
                  {hotel.address.city}, {hotel.address.country}
                </p>
                <p className="mt-2 text-sm font-medium text-black flex items-center gap-1">
                  {hotel.rating.toFixed(1)} <span className="text-black">★</span>
                </p>

                <button
                  onClick={() => onDelete(hotel.id)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                  title="Remover hotel"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-gray-700"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={page === pagination.totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-gray-700"
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
