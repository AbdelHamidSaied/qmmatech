import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { insertListSchema } from "@/db/schema";
import { useNewList } from "../hooks/use-new-list";
import { useCreateList } from "../api/use-create-list";
import { useGetCampaigns } from "@/features/campaigns/api/use-get-campaigns";
import { ListForm } from "./list-form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string(),
  campaignId: z.string(),
  dailyLimit: z.number().optional(),
  dailySendingLimit: z.number().optional(),
  fromSrl: z.number().optional(),
  toSrl: z.number().optional(),
  ignoreCustomersReceivedMessage: z.number().optional(),
  type: z.enum(["run-now", "schedule"]),
  scheduleDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewListSheet = () => {
  const { isOpen, onClose } = useNewList();

  const createMutation = useCreateList();

  const campaignQuery = useGetCampaigns();
  const campaignOptions = (campaignQuery.data ?? []).map((campaign) => ({
    label: campaign.name,
    value: campaign.id,
  }));

  const isPending = createMutation.isPending;

  const isLoading = campaignQuery.isLoading;

  const onSubmit = (json: FormValues) => {
    createMutation.mutate(
      { json },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New List</SheetTitle>
          <SheetDescription>Create a new list</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <ListForm
            onSubmit={onSubmit}
            disabled={isPending}
            campaignOptions={campaignOptions}
            defaultValues={{
              type: "run-now",
              name: "",
              campaignId: "",
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
