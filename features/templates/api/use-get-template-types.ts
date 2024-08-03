import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetTemplateTypes = () => {
  const query = useQuery({
    queryKey: ["template-types"],
    queryFn: async () => {
      const response = await client.api.templates["types"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch template types");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
