import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.templates)["archive"][":id"]["$delete"]
>;

export const useArchiveTemplate = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.templates["archive"][":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Template archived");
      queryClient.invalidateQueries({ queryKey: ["template", { id }] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["archived-templates"] });
    },
    onError: () => {
      toast.error("Failed to archive template");
    },
  });

  return mutation;
};
