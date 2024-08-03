import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { TemplateForm } from "./template-form";
import { Loader2 } from "lucide-react";
import { useNewTemplate } from "../hooks/use-new-template";
import { useCreateTemplate } from "../api/use-create-template";
import { useGetTemplate } from "../api/use-get-template";
import { db } from "@/db/drizzle";
import { useGetTemplateCategories } from "../api/use-get-template-categories";
import { useGetTemplateTypes } from "../api/use-get-template-types";
import { useGetTemplateLanguages } from "../api/use-get-template-languages";
import { useGetTemplateHeaderTypes } from "../api/use-get-template-header-types";
import { useGetTemplateButtonTypes } from "../api/use-get-template-button-types";

const formSchema = z.object({
  name: z.string(),
  allowCategoryChange: z.boolean(),
  categoryId: z.string(),
  typeId: z.string(),
  languageId: z.string(),
  headerId: z.string().nullable(),
  bodyMessage: z.string(),
  footerId: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewTemplateSheet = () => {
  const { isOpen, onClose } = useNewTemplate();

  const createMutation = useCreateTemplate();

  const categoryQuery = useGetTemplateCategories();
  const categoryOptions = categoryQuery.data ?? [];

  const typeQuery = useGetTemplateTypes();
  const typeOptions = typeQuery.data ?? [];

  const languageQuery = useGetTemplateLanguages();
  const languageOptions = languageQuery.data ?? [];

  const headerQuery = useGetTemplateHeaderTypes();
  const headerOptions = headerQuery.data ?? [];

  const buttonsQuery = useGetTemplateButtonTypes();
  const buttonOptions = buttonsQuery.data ?? [];

  const isPending = createMutation.isPending;
  const isLoading =
    categoryQuery.isLoading || typeQuery.isLoading || languageQuery.isLoading;

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
          <SheetTitle>New Template</SheetTitle>
          <SheetDescription>Create a new template</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TemplateForm
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={{
              name: "",
              allowCategoryChange: false,
              categoryId: "",
              languageId: "",
              typeId: "",
              bodyMessage: "",
              buttonsAvailable: false,
              header: false,
              footer: false,
            }}
            categoryOptions={categoryOptions}
            typeOptions={typeOptions}
            languageOptions={languageOptions}
            headerOptions={headerOptions}
            buttonOptions={buttonOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
