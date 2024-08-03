import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./campaign-columns";
import { useNewCampaign } from "@/features/campaigns/hooks/use-new-campaign";
import { useBulkDeleteCampaigns } from "@/features/campaigns/api/use-bulk-delete-campaigns";
import { useGetCampaigns } from "@/features/campaigns/api/use-get-campaigns";

export const CampaignsTable = () => {
  const newCampaign = useNewCampaign();
  const deleteCampaigns = useBulkDeleteCampaigns();
  const campaignsQuery = useGetCampaigns();
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
        <CardTitle className="text-xl line-clamp-1">Campaigns Page</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={newCampaign.onOpen}
            size="sm"
            className="w-full lg:w-auto"
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </div>
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
