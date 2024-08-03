import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetTemplate = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["template", { id }],
    queryFn: async () => {
      const response = await client.api.templates[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
