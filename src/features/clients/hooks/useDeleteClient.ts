import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "../api/client.api";
import { Client } from "../schemas/client.schema";

const QUERY_KEY = ["clients", "paginated"];

const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousData = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((client: Client) => client.id !== deletedId),
          })),
        };
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", "paginated"] });
    },
  });
};

export default useDeleteClient;
