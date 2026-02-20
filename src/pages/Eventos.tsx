import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Loader2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import { NewEventDialog } from "@/components/events/NewEventDialog";
import { ProductEditSheet } from "@/components/products/ProductEditSheet";

export default function Eventos() {
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, active, event_date, event_modality, event_location, is_event")
        .eq("is_event", true)
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-secondary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Eventos</h1>
            <p className="text-sm text-muted-foreground">
              {events?.length ?? 0} evento{events?.length !== 1 ? "s" : ""} cadastrado{events?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setNewEventOpen(true)}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event as any}
              onEdit={(ev) => setEditingEvent(ev)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Nenhum evento cadastrado</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm mb-6">
            Crie seu primeiro evento para gerenciar inscrições, confirmados e resultados de NPS em um só lugar.
          </p>
          <Button
            onClick={() => setNewEventOpen(true)}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar primeiro evento
          </Button>
        </div>
      )}

      <NewEventDialog open={newEventOpen} onOpenChange={setNewEventOpen} />

      {/* Reuse ProductEditSheet for editing — it has all the advanced fields */}
      <ProductEditSheet
        product={editingEvent}
        open={!!editingEvent}
        onOpenChange={(open) => {
          if (!open) setEditingEvent(null);
          queryClient.invalidateQueries({ queryKey: ["events"] });
        }}
      />
    </div>
  );
}
