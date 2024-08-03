import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetArchivedCampaigns = () => {
  const query = useQuery({
    queryKey: ["archived-campaigns"],
    queryFn: async () => {
      const response = await client.api.campaigns["archived"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to get archived campaigns");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
