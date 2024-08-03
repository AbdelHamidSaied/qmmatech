import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetTemplateHeaderTypes = () => {
  const query = useQuery({
    queryKey: ["template-header-types"],
    queryFn: async () => {
      const response = await client.api.templates["header-types"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch template header-types");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
