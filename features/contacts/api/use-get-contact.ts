import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetContact = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["contact", { id }],
    queryFn: async () => {
      const response = await client.api.contacts[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contact");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
