"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { UploadButton } from "./upload-button";
import { DataTable } from "@/components/data-table";
import { useNewContact } from "@/features/contacts/hooks/use-new-contact";
import { useBulkCreateContacts } from "@/features/contacts/api/use-bulk-create-contacts";
import { useBulkDeleteContacts } from "@/features/contacts/api/use-bulk-delete-contacts";
import { useGetContacts } from "@/features/contacts/api/use-get-contacts";
import { useEffect, useState } from "react";
import ImportCard from "./import-card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { contacts as contactSchema } from "@/db/schema";
import { useQueryClient } from "@tanstack/react-query";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

type Props = {
  filterKey?:
    | "hasWhatsApp"
    | "blockedCampaigns"
    | "blockedFromBot"
    | "blockedFromCC";
};

export const ContactsTable = ({ filterKey }: Props) => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const queryClient = useQueryClient();
  const newContact = useNewContact();
  const createContacts = useBulkCreateContacts();
  const deleteContacts = useBulkDeleteContacts();
  const contactsQuery = useGetContacts(filterKey);
  const contacts = contactsQuery.data || [];

  const isDisabled = contactsQuery.isLoading || deleteContacts.isPending;

  const onSubmitImport = async (
    values: (typeof contactSchema.$inferInsert)[]
  ) => {
    createContacts.mutate(values, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  }, [queryClient]);

  if (contactsQuery.isLoading) {
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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="gap-y-2 lg:flex-row lg:items-start lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">Contacts Page</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={newContact.onOpen}
            size="sm"
            className="w-full lg:w-auto"
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
          <UploadButton onUpload={onUpload} />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          filterKey="phone"
          columns={columns}
          data={contacts}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteContacts.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
