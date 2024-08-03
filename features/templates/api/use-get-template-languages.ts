import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetTemplateLanguages = () => {
  const query = useQuery({
    queryKey: ["template-languages"],
    queryFn: async () => {
      const response = await client.api.templates["languages"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch template languages");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
