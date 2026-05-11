import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "../api/client.api";
import { Client } from "../schemas/client.schema";

const QUERY_KEY = ["clients", "paginated"];

const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousData = queryClient.getQueryData(QUERY_KEY);

      return { previousData };
    },

    onError: (_err, _updatedClient, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY, context.previousData);
      }
    },

    onSuccess: (updatedClient: Client) => {
      queryClient.setQueryData(QUERY_KEY, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((client: Client) =>
              client.id === updatedClient.id
                ? { ...client, ...updatedClient }
                : client,
            ),
          })),
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export default useUpdateClient;
