import { useState, useEffect } from "react";
import { Phone, PhoneCall, PhoneMissed, Minus, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Deal } from "./types";

interface CallsTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
  targetStageId: string | null;
  onSuccess: () => void;
}

export function CallsTrackingDialog({
  open,
  onOpenChange,
  deal,
  targetStageId,
  onSuccess,
}: CallsTrackingDialogProps) {
  const queryClient = useQueryClient();
  const [callsAnswered, setCallsAnswered] = useState(0);
  const [callsMissed, setCallsMissed] = useState(0);

  // Reset values when dialog opens with a new deal
  useEffect(() => {
    if (open && deal) {
      setCallsAnswered((deal as any).calls_answered || 0);
      setCallsMissed((deal as any).calls_missed || 0);
    }
  }, [open, deal]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!deal || !targetStageId) throw new Error("Deal ou estágio não encontrado");

      const { error } = await supabase
        .from("deals")
        .update({
          stage_id: targetStageId,
          calls_answered: callsAnswered,
          calls_missed: callsMissed,
        })
        .eq("id", deal.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ligações registradas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      onSuccess();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Erro ao registrar ligações");
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  const incrementAnswered = () => setCallsAnswered((prev) => prev + 1);
  const decrementAnswered = () => setCallsAnswered((prev) => Math.max(0, prev - 1));
  const incrementMissed = () => setCallsMissed((prev) => prev + 1);
  const decrementMissed = () => setCallsMissed((prev) => Math.max(0, prev - 1));

  const totalCalls = callsAnswered + callsMissed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-secondary" />
            Registrar Ligações
          </DialogTitle>
          <DialogDescription>
            Registre quantas ligações foram feitas para{" "}
            <span className="font-medium text-foreground">{deal?.lead?.full_name || "este lead"}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Ligações Atendidas */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-green-500/30 bg-green-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <PhoneCall className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-green-400">Atendidas</p>
                <p className="text-xs text-green-500/70">Ligações completadas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:bg-muted"
                onClick={decrementAnswered}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-xl font-bold text-green-400">
                {callsAnswered}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:bg-muted"
                onClick={incrementAnswered}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Ligações Perdidas */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <PhoneMissed className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-red-400">Perdidas</p>
                <p className="text-xs text-red-500/70">Não atendeu / Ocupado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:bg-muted"
                onClick={decrementMissed}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-xl font-bold text-red-400">
                {callsMissed}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:bg-muted"
                onClick={incrementMissed}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="text-sm">
              Total: <span className="font-semibold text-foreground">{totalCalls}</span> ligações
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-secondary hover:bg-secondary/90"
          >
            {mutation.isPending ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
