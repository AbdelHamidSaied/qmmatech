"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCampaign } from "@/features/campaigns/api/use-delete-campaign";
import { useRestoreCampaign } from "@/features/campaigns/api/use-restore-campaign";
import { useConfirm } from "@/hooks/use-confirm";
import { MoreHorizontal, StopCircle, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const ArchiveActions = ({ id }: Props) => {
  const [DeleteConfirmDialog, deleteConfirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this campaign."
  );

  const deleteMutation = useDeleteCampaign(id);
  const restoreMutation = useRestoreCampaign(id);

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
