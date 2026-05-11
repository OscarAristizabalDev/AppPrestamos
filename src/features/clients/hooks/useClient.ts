import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientsPaginated } from "../api/client.api";
import { useDebounce } from "@/src/hooks/useDebounce";

const STALE_TIME = 1000 * 60 * 5; // 5 minutos: no vuelve a pedir si ya tiene datos frescos
const GC_TIME = 1000 * 60 * 10; // 10 minutos: mantiene en caché aunque se desmonte la pantalla

const useInfiniteClients = (searchQuery: string) => {
  const debouncedQuery = useDebounce(searchQuery, 400);
  return useInfiniteQuery({
    queryKey: ["clients", "paginated", debouncedQuery],
    queryFn: ({ pageParam = 1 }) =>
      getClientsPaginated({
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

export default useInfiniteClients;
