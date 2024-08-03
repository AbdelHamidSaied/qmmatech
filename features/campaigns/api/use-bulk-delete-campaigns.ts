import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.campaigns)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.campaigns)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteCampaigns = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.campaigns["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Campaigns deleted");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: () => {
      toast.error("Failed to delete campaigns");
    },
  });

  return mutation;
};
