import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, Calendar, Plus, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Participant {
  name: string;
  role: string;
}

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLE_OPTIONS = [
  "Entrevistador",
  "Entrevistado",
  "Mentor",
  "Palestrante",
  "Moderador",
  "Convidado Especial",
];

export function NewEventDialog({ open, onOpenChange }: NewEventDialogProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    event_date: "",
    event_modality: "presencial" as "presencial" | "online" | "hibrido",
    event_location: "",
    slug: "",
    template_id: "",
    active: true,
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", role: "Entrevistado" });

  const { data: formTemplates } = useQuery({
    queryKey: ["page_templates", "application_form"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_templates")
        .select("*")
        .eq("type", "application_form")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const generateSlug = () => {
    if (form.name) {
      const slug = form.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setForm((f) => ({ ...f, slug }));
    }
  };

  const addParticipant = () => {
    if (!newParticipant.name.trim()) return;
    setParticipants((prev) => [...prev, { name: newParticipant.name.trim(), role: newParticipant.role }]);
    setNewParticipant({ name: "", role: "Entrevistado" });
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const createEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        name: form.name,
        slug: form.slug || null,
        template_id: form.template_id || null,
        active: form.active,
        is_event: true,
        event_date: form.event_date || null,
        event_modality: form.event_modality,
        event_location: form.event_location || null,
        event_participants: participants,
        funnel_type: "internal_form",
        create_deal: false,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento criado com sucesso!");
      onOpenChange(false);
      setForm({ name: "", event_date: "", event_modality: "presencial", event_location: "", slug: "", template_id: "", active: true });
      setParticipants([]);
      setNewParticipant({ name: "", role: "Entrevistado" });
    },
    onError: (err: Error) => {
      toast.error("Erro ao criar evento: " + err.message);
    },
  });

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Nome do evento é obrigatório");
      return;
    }
    createEvent.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5 text-secondary" />
            Novo Evento
          </DialogTitle>
          <DialogDescription>
            Crie um novo evento com participantes, data e página de inscrição pública.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="ev-name">Nome do Evento *</Label>
            <Input
              id="ev-name"
              placeholder="Ex: Grifo Talks #3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="ev-date">Data e Hora</Label>
            <Input
              id="ev-date"
              type="datetime-local"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            />
          </div>

          {/* Modalidade */}
          <div className="space-y-2">
            <Label>Modalidade</Label>
            <Select
              value={form.event_modality}
              onValueChange={(v) => setForm({ ...form, event_modality: v as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Local */}
          <div className="space-y-2">
            <Label htmlFor="ev-location">
              {form.event_modality === "online" ? "Link da sala / plataforma" : "Endereço / Local"}
            </Label>
            <Input
              id="ev-location"
              placeholder={
                form.event_modality === "online"
                  ? "https://meet.google.com/..."
                  : "Rua, Número, Bairro, Cidade"
              }
              value={form.event_location}
              onChange={(e) => setForm({ ...form, event_location: e.target.value })}
            />
          </div>

          <Separator />

          {/* Participantes */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" />
              Participantes do Evento
            </Label>
            <p className="text-xs text-muted-foreground">
              Adicione os nomes principais: mentor, entrevistador, palestrante, etc.
            </p>

            {/* Lista de participantes adicionados */}
            {participants.length > 0 && (
              <div className="space-y-2">
                {participants.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-secondary">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{p.role}</Badge>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeParticipant(i)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar novo participante */}
            <div className="flex gap-2">
              <Input
                placeholder="Nome do participante"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addParticipant()}
                className="flex-1"
              />
              <Select
                value={newParticipant.role}
                onValueChange={(v) => setNewParticipant({ ...newParticipant, role: v })}
              >
                <SelectTrigger className="w-[150px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={addParticipant}
                disabled={!newParticipant.name.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Template */}
          <div className="space-y-2">
            <Label>Template do Formulário de Inscrição</Label>
            <Select
              value={form.template_id || "none"}
              onValueChange={(v) => setForm({ ...form, template_id: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um formulário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum (só landing page)</SelectItem>
                {formTemplates?.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="ev-slug">Slug (URL)</Label>
            <div className="flex gap-2">
              <Input
                id="ev-slug"
                placeholder="grifo-talks-3"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <Button type="button" variant="outline" onClick={generateSlug} className="shrink-0">
                Gerar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">URL: /p/{form.slug || "slug-do-evento"}</p>
          </div>

          {/* Ativo */}
          <div className="flex items-center gap-4 p-3 rounded-lg border border-border">
            <Switch
              id="ev-active"
              checked={form.active}
              onCheckedChange={(v) => setForm({ ...form, active: v })}
            />
            <div>
              <Label htmlFor="ev-active" className="cursor-pointer">Evento Ativo</Label>
              <p className="text-xs text-muted-foreground">Inscrições abertas ao público</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            disabled={createEvent.isPending || !form.name.trim()}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {createEvent.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Criar Evento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
