import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ListForm } from "./list-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useOpenList } from "../hooks/use-open-list";
import { useGetList } from "../api/use-get-list";
import { useEditList } from "../api/use-edit-list";
import { useDeleteList } from "../api/use-delete-list";
import { insertListSchema } from "@/db/schema";

const formSchema = insertListSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

export const EditListSheet = () => {
  const { isOpen, onClose, id } = useOpenList();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this list."
  );

  const listQuery = useGetList(id);
  const editMutation = useEditList(id);
  const deleteMutation = useDeleteList(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = listQuery.isLoading;

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

  const defaultValues = listQuery.data
    ? {
        name: listQuery.data.name,
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
            <SheetTitle>Edit List</SheetTitle>
            <SheetDescription>Edit an existing list</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <ListForm
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
              id={id}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
