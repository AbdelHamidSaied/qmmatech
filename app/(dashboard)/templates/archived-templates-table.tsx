"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { useBulkDeleteTemplates } from "@/features/templates/api/use-bulk-delete-templates";
import { useGetArchivedTemplates } from "@/features/templates/api/use-get-archived-templates";

export const ArchivedTemplatesTable = () => {
  const deleteTemplates = useBulkDeleteTemplates();
  const templatesQuery = useGetArchivedTemplates();
  const templates = templatesQuery.data || [];

  const isDisabled = templatesQuery.isLoading || deleteTemplates.isPending;

  if (templatesQuery.isLoading) {
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
    <Card className="border-none drop-shadow-sm -mt-24">
      <CardHeader className="gap-y-2 lg:flex-row lg:items-start lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">Archived Templates Page</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          filterKey="name"
          columns={columns}
          data={templates}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteTemplates.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};