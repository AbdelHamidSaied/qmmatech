import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetContacts = (
  filterKey?:
    | "hasWhatsApp"
    | "blockedCampaigns"
    | "blockedFromBot"
    | "blockedFromCC"
) => {
  const query = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await client.api.contacts.$get({ query: { filterKey } });

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
