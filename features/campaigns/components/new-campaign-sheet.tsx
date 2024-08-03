import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CampaignForm } from "./campaign-form";
import { insertCampaignSchema } from "@/db/schema";
import { z } from "zod";
import { useNewCampaign } from "../hooks/use-new-campaign";
import { useCreateCampaign } from "../api/use-create-campaign";

const apiFormValues = z.object({
  name: z.string(),
  excel: z.string()
});

type FormValues = z.infer<typeof apiFormValues>;

export const NewCampaignSheet = () => {
  const { isOpen, onClose } = useNewCampaign();

  const mutation = useCreateCampaign();

  const onSubmit = (json: FormValues) => {
    mutation.mutate(
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
          <SheetTitle>New Campaign</SheetTitle>
          <SheetDescription>Create a new campaign</SheetDescription>
        </SheetHeader>
        <CampaignForm onSubmit={onSubmit} disabled={mutation.isPending} />
      </SheetContent>
    </Sheet>
  );
};
