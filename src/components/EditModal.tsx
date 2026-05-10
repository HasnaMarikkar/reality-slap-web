import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateRoast, type Roast } from "@/lib/roasts-api";

interface EditModalProps {
  roast: Roast | null;
  onClose: () => void;
}

export function EditModal({ roast, onClose }: EditModalProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ roast: "", reality_check: "", advice: "" });

  useEffect(() => {
    if (roast) {
      setForm({
        roast: roast.roast,
        reality_check: roast.reality_check,
        advice: roast.advice,
      });
    }
  }, [roast]);

  const mutation = useMutation({
    mutationFn: () => updateRoast(roast!.id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roasts"] });
      toast.success("Roast updated");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={!!roast} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit roast</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {(["roast", "reality_check", "advice"] as const).map((key) => (
            <div key={key} className="space-y-1.5">
              <Label className="capitalize text-xs uppercase tracking-wider text-muted-foreground">
                {key.replace("_", " ")}
              </Label>
              <Textarea
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                rows={key === "advice" ? 4 : 3}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-gradient-brand text-primary-foreground"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
