import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.lists)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.lists)[":id"]["$patch"]
>["json"];

export const useEditList = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.lists[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("List updated");
      queryClient.invalidateQueries({ queryKey: ["list", { id }] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: () => {
      toast.error("Failed to edit list");
    },
  });

  return mutation;
};
