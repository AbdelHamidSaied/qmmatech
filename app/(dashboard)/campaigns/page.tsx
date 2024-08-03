"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsTable } from "./campaigns-table";
import { ArchivedCampaignsTable } from "./archived-campaigns-table";
import { ListsTable } from "./lists-table";
import { ArchivedListsTable } from "./archived-lists-table";

const CampaignsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24"
      defaultValue="campaigns"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        <TabsTrigger value="lists">Lists</TabsTrigger>
        <TabsTrigger value="archived-campaigns">Archived Campaigns</TabsTrigger>
        <TabsTrigger value="archived-lists">Archived Lists</TabsTrigger>
      </TabsList>
      <TabsContent value="campaigns">
        <CampaignsTable />
      </TabsContent>
      <TabsContent value="lists">
        <ListsTable />
      </TabsContent>
      <TabsContent value="archived-campaigns">
        <ArchivedCampaignsTable />
      </TabsContent>
      <TabsContent value="archived-lists">
        <ArchivedListsTable />
      </TabsContent>
    </Tabs>
  );
};

export default CampaignsPage;
