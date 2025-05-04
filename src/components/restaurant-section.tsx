import { Utensils, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";

type Restaurant = {
  id: string;
  name: string;
  rating: string;
  priceLevel: number;
  address: {
    street: string;
    number: string;
    neighborhood?: string;
    city: string;
    country: string;
  };
};

type Pagination = {
  totalPages: number;
};

type Props = {
  restaurants: Restaurant[];
  isLoading: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pagination?: Pagination;
  onAdd: () => void;
  onDelete: (id: string) => void;
};

export default function RestaurantSection({
  restaurants,
  isLoading,
  page,
  setPage,
  pagination,
  onAdd,
  onDelete,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Utensils size={16} className="text-indigo-600" />
          <h3 className="text-sm font-medium text-gray-900">Restaurantes</h3>
        </div>
        <button
          className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
          onClick={onAdd}
        >
          <Plus size={14} /> Add restaurante
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-gray-400 py-4">Carregando restaurantes...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-4">Não possui restaurantes adicionados ainda</div>
      ) : (
        <>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin max-h-[300px]">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="border rounded-xl p-4 bg-gray-50 hover:shadow transition-shadow relative"
              >
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{restaurant.name}</h4>
                <p className="text-sm text-gray-600 leading-tight break-words whitespace-normal">
                  {restaurant.address.street} {restaurant.address.number},{" "}
                  {restaurant.address.neighborhood && restaurant.address.neighborhood + ", "}
                  {restaurant.address.city}, {restaurant.address.country}
                </p>
                <p className="mt-2 text-sm font-medium text-black flex items-center gap-1">
                  {restaurant.rating} <span className="text-black">★</span>
                  {restaurant.priceLevel > 0 && (
                    <span className="text-gray-500 ml-2">
                      {"$".repeat(restaurant.priceLevel)}
                    </span>
                  )}
                </p>

                <button
                  onClick={() => onDelete(restaurant.id)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                  title="Remover restaurante"
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
