import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewContact } from "../hooks/use-new-contact";
import { ContactForm } from "./contact-form";
import { insertContactSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateContact } from "../api/use-create-contact";

const formSchema = insertContactSchema.omit({
  id: true,
  userId: true,
});

type FormValues = z.infer<typeof formSchema>;

export const NewContactSheet = () => {
  const { isOpen, onClose } = useNewContact();

  const mutation = useCreateContact();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Contact</SheetTitle>
          <SheetDescription>Create a new contact</SheetDescription>
        </SheetHeader>
        <ContactForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            phone: "",
            firstName: "",
            lastName: "",
            email: "",
            hasWhatsApp: true,
            blockedCampaigns: false,
            blockedFromBot: false,
            blockedFromCC: false,
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
