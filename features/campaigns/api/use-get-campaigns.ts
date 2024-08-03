import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetCampaigns = () => {
  const query = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await client.api.campaigns.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
