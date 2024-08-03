import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetTemplates = () => {
  const query = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await client.api.templates.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
