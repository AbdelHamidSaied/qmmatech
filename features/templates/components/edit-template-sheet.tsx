import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TemplateForm } from "./template-form";
import { useOpenTemplate } from "../hooks/use-open-template";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetTemplate } from "../api/use-get-template";
import { useEditTemplate } from "../api/use-edit-template";
import { useDeleteTemplate } from "../api/use-delete-template";
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
  bodyMessage: z.string(),
  header: z.boolean().default(false),
  headerTypeId: z.string().optional(),
  headerText: z.string().optional(),
  footer: z.boolean().default(false),
  footerText: z.string().optional(),
  buttonsAvailable: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export const EditTemplateSheet = () => {
  const { isOpen, onClose, id } = useOpenTemplate();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this template."
  );

  const templateQuery = useGetTemplate(id);
  const editMutation = useEditTemplate(id);
  const deleteMutation = useDeleteTemplate(id);

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

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading =
    categoryQuery.isLoading ||
    typeQuery.isLoading ||
    languageQuery.isLoading ||
    templateQuery.isLoading;

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

  const defaultValues = templateQuery.data
    ? {
        name: templateQuery.data.name,
        allowCategoryChange: templateQuery.data.allowCategoryChange,
        categoryId: templateQuery.data.categoryId,
        languageId: templateQuery.data.languageId,
        typeId: templateQuery.data.typeId,
        bodyMessage: templateQuery.data.bodyMessage,
        headerId: templateQuery.data.headerId,
        footerId: templateQuery.data.footerId,
      }
    : {
        name: "",
        allowCategoryChange: false,
        categoryId: "",
        languageId: "",
        typeId: "",
        bodyMessage: "",
        headerId: "",
        footerId: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Template</SheetTitle>
            <SheetDescription>Edit an existing template</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TemplateForm
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              categoryOptions={categoryOptions}
              typeOptions={typeOptions}
              languageOptions={languageOptions}
              headerOptions={headerOptions}
              buttonOptions={buttonOptions}
              id={id}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
