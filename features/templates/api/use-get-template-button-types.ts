import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetTemplateButtonTypes = () => {
  const query = useQuery({
    queryKey: ["template-button-types"],
    queryFn: async () => {
      const response = await client.api.templates["button-types"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch template button types");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
