import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CampaignForm } from "./campaign-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { insertCampaignSchema } from "@/db/schema";
import { useOpenCampaign } from "../hooks/use-open-campaign";
import { useGetCampaign } from "../api/use-get-campaign";
import { useEditCampaign } from "../api/use-edit-campaign";
import { useDeleteCampaign } from "../api/use-delete-campaign";
import { EditCampaignForm } from "./edit-campaign-form";

const formSchema = z.object({
  name: z.string().min(2),
});

type FormValues = z.infer<typeof formSchema>;

export const EditCampaignSheet = () => {
  const { isOpen, onClose, id } = useOpenCampaign();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this campaign."
  );

  const campaignQuery = useGetCampaign(id);
  const editMutation = useEditCampaign(id);
  const deleteMutation = useDeleteCampaign(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = campaignQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = campaignQuery.data
    ? {
        name: campaignQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Campaign</SheetTitle>
            <SheetDescription>Edit an existing campaign</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <EditCampaignForm
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
