import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/src/hooks/useDebounce";
import { getProductsPaginated } from "../api/product.api";

export const useSearchProducts = (query: string) => {
  const debouncedQuery = useDebounce(query, 400);

  return useQuery({
    queryKey: ["products", "productsSearch", debouncedQuery],
    queryFn: () =>
      getProductsPaginated({
        pageParam: 1,
        inputSearch: debouncedQuery || undefined,
      }),
    // Solo ejecuta si hay texto de búsqueda O si es la carga inicial explícita
    enabled: debouncedQuery.length > 0,
    // No refetchear automáticamente al montar o recuperar focus
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 2, // 2 min
  });
};
