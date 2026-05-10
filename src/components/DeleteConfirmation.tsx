import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteRoast, type Roast } from "@/lib/roasts-api";

interface Props {
  roast: Roast | null;
  onClose: () => void;
}

export function DeleteConfirmation({ roast, onClose }: Props) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteRoast(roast!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roasts"] });
      toast.success("Roast deleted");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AlertDialog open={!!roast} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this roast?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the entry. No undo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            {mutation.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
