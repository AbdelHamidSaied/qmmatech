"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArchiveList } from "@/features/lists/api/use-archive-list";
import { useDeleteList } from "@/features/lists/api/use-delete-list";
import { useStopList } from "@/features/lists/api/use-stop-list";
import { useOpenList } from "@/features/lists/hooks/use-open-list";
import { useConfirm } from "@/hooks/use-confirm";
import { Archive, Edit, MoreHorizontal, StopCircle, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const [DeleteConfirmDialog, deleteConfirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this list."
  );
  const [ArchiveConfirmDialog, archiveConfirm] = useConfirm(
    "Are you sure?",
    "You are about to archive this list."
  );
  const [StopConfirmDialog, stopConfirm] = useConfirm(
    "Are you sure?",
    "You are about to stop this list."
  );

  const deleteMutation = useDeleteList(id);
  const archiveMutation = useArchiveList(id);
  const stopMutation = useStopList(id);
  const { onOpen } = useOpenList();

  const handleDelete = async () => {
    const ok = await deleteConfirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  const handleArchive = async () => {
    const ok = await archiveConfirm();

    if (ok) {
      archiveMutation.mutate();
    }
  };

  const handleStop = async () => {
    const ok = await stopConfirm();

    if (ok) {
      stopMutation.mutate();
    }
  };

  const disabled =
    deleteMutation.isPending ||
    archiveMutation.isPending ||
    stopMutation.isPending;

  return (
    <>
      <DeleteConfirmDialog />
      <ArchiveConfirmDialog />
      <StopConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={disabled} onClick={() => onOpen(id)}>
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={handleArchive}>
            <Archive className="size-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={handleStop}>
            <StopCircle className="size-4 mr-2" />
            Stop
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
