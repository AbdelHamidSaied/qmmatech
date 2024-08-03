import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetArchivedLists = () => {
  const params = useSearchParams()
  const campaignId = params.get("campaignId") || "";

  const query = useQuery({
    queryKey: ["archived-lists", { campaignId }],
    queryFn: async () => {
      const response = await client.api.lists["archived"]["$get"]({
        query: { campaignId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lists");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
