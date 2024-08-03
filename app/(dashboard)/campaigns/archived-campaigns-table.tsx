import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./archive-campaign-columns";
import { useBulkDeleteCampaigns } from "@/features/campaigns/api/use-bulk-delete-campaigns";
import { useGetArchivedCampaigns } from "@/features/campaigns/api/use-get-archived-campaigns";

export const ArchivedCampaignsTable = () => {
  const deleteCampaigns = useBulkDeleteCampaigns();
  const campaignsQuery = useGetArchivedCampaigns();
  const campaigns = campaignsQuery.data || [];

  const isDisabled = campaignsQuery.isLoading || deleteCampaigns.isPending;

  if (campaignsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="gap-y-2 lg:flex-row lg:items-start lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">Archived Campaigns Page</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          filterKey="name"
          columns={columns}
          data={campaigns}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteCampaigns.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
