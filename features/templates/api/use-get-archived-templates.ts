import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetArchivedTemplates = () => {
  const query = useQuery({
    queryKey: ["archived-templates"],
    queryFn: async () => {
      const response = await client.api.templates["archived"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
