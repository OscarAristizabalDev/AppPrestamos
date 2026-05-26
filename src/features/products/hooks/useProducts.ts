import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsPaginated } from "../api/product.api";
import { useDebounce } from "@/src/hooks/useDebounce";

const STALE_TIME = 1000 * 60 * 5; // 5 minutos: no vuelve a pedir si ya tiene datos frescos
const GC_TIME = 1000 * 60 * 10; // 10 minutos: mantiene en caché aunque se desmonte la pantalla

const useInfiniteProducts = (searchQuery: string) => {
  const debouncedQuery = useDebounce(searchQuery, 400);
  return useInfiniteQuery({
    queryKey: ["products", "paginatedProducts", debouncedQuery],
    queryFn: ({ pageParam = 1 }) =>
      getProductsPaginated({
        pageParam,
        inputSearch: debouncedQuery || undefined,
      }),
    initialPageParam: 1,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export default useInfiniteProducts;
