import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../api/client.api";
import { Client } from "../schemas/client.schema";

const QUERY_KEY = ["clients", "paginated"];

const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onMutate: async (newClient) => {
      // Cancelar refetches pendientes para no sobreescribir nuestro cambio
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      // Snapshot de la caché actual para poder revertir
      const previousData = queryClient.getQueryData(QUERY_KEY);

      // Generamos un ID temporal mientras el servidor responde
      const optimisticClient: Client = {
        ...newClient,
        id: `temp-${Date.now()}`,
      };

      // Insertamos al inicio de la primera página
      queryClient.setQueryData(QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, index: number) =>
            index === 0
              ? { ...page, data: [optimisticClient, ...page.data] }
              : page,
          ),
        };
      });

      // Devolvemos el contexto para revertir en caso de error
      return { previousData };
    },

    // Si el request falla: revertimos a la caché anterior
    onError: (_err, _newClient, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY, context.previousData);
      }
    },

    // Cuando termina (éxito o error): invalidamos para sincronizar con el servidor
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", "paginated"] });
    },
  });
};

export default useCreateClient;
