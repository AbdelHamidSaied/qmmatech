import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.campaigns)["archive"][":id"]["$delete"]
>;

export const useArchiveCampaign = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.campaigns["archive"][":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("campaign archived");
      queryClient.invalidateQueries({ queryKey: ["campaign", { id }] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["archived-campaigns"] });
    },
    onError: () => {
      toast.error("Failed to archive campaign");
    },
  });

  return mutation;
};
