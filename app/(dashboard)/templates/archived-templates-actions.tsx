"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTemplate } from "@/features/templates/api/use-delete-template";
import { useRestoreTemplate } from "@/features/templates/api/use-restore-template";
import { useConfirm } from "@/hooks/use-confirm";
import { MoreHorizontal, StopCircle, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const ArchiveActions = ({ id }: Props) => {
  const [DeleteConfirmDialog, deleteConfirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this template."
  );

  const deleteMutation = useDeleteTemplate(id);
  const restoreMutation = useRestoreTemplate(id);

  const handleDelete = async () => {
    const ok = await deleteConfirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  const disabled =
    deleteMutation.isPending ||
    restoreMutation.isPending

  return (
    <>
      <DeleteConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={disabled} onClick={() => restoreMutation.mutate()}>
            <StopCircle className="size-4 mr-2" />
            Restore
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={handleDelete}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
