import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetCampaign = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["campaign", { id }],
    queryFn: async () => {
      const response = await client.api.campaigns[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch campaign");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
