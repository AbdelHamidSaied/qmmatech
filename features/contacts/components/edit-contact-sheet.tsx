import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ContactForm } from "./contact-form";
import { insertContactSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenContact } from "../hooks/use-open-contact";
import { useGetContact } from "../api/use-get-contact";
import { Loader2 } from "lucide-react";
import { useEditContact } from "../api/use-edit-contact";
import { useDeleteContact } from "../api/use-delete-contact";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertContactSchema.omit({
  id: true,
  userId: true,
});

type FormValues = z.infer<typeof formSchema>;

export const EditContactSheet = () => {
  const { isOpen, onClose, id } = useOpenContact();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this contact."
  );

  const contactQuery = useGetContact(id);
  const editMutation = useEditContact(id);
  const deleteMutation = useDeleteContact(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = contactQuery.isLoading;

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

  const defaultValues = contactQuery.data
    ? {
        phone: contactQuery.data.phone,
        firstName: contactQuery.data.firstName,
        lastName: contactQuery.data.lastName,
        email: contactQuery.data.email,
        hasWhatsApp: contactQuery.data.hasWhatsApp,
        blockedCampaigns: contactQuery.data.blockedCampaigns,
        blockedFromBot: contactQuery.data.blockedFromBot,
        blockedFromCC: contactQuery.data.blockedFromCC,
      }
    : {
        phone: "",
        firstName: "",
        lastName: "",
        email: "",
        hasWhatsApp: true,
        blockedCampaigns: false,
        blockedFromBot: false,
        blockedFromCC: false,
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Contact</SheetTitle>
            <SheetDescription>Edit an existing contact</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <ContactForm
              id={id}
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
