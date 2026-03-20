import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientsPaginated } from "../api/client.api";

const useInfiniteClients = () => {
  return useInfiniteQuery({
    queryKey: ["clients"],
    queryFn: ({ pageParam = 1 }) => getClientsPaginated({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export default useInfiniteClients;
