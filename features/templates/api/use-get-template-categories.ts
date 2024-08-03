import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetTemplateCategories = () => {
  const query = useQuery({
    queryKey: ["template-categories"],
    queryFn: async () => {
      const response = await client.api.templates["categories"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch template categories");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
