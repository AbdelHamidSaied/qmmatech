import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetList = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["list", { id }],
    queryFn: async () => {
      const response = await client.api.lists[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch list");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
