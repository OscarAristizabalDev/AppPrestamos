import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../api/client.api";

const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export default useCreateClient;
