import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  BarChart3,
  Edit,
  Monitor,
  Building2,
  Wifi,
  MoreVertical,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GrifoTalkAttendeesSheet } from "@/components/products/GrifoTalkAttendeesSheet";
import NpsResultsSheet from "@/components/nps/NpsResultsSheet";

interface EventProduct {
  id: string;
  name: string;
  slug: string | null;
  active: boolean | null;
  event_date: string | null;
  event_modality: string | null;
  event_location: string | null;
  is_event: boolean | null;
}

interface EventCardProps {
  event: EventProduct;
  onEdit: (event: EventProduct) => void;
}

const modalityConfig = {
  presencial: { label: "Presencial", icon: Building2, color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
  online: { label: "Online", icon: Monitor, color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" },
  hibrido: { label: "Híbrido", icon: Wifi, color: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800" },
};

export function EventCard({ event, onEdit }: EventCardProps) {
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [npsOpen, setNpsOpen] = useState(false);

  // Count form submissions (registrations)
  const { data: submissionCount } = useQuery({
    queryKey: ["event_submissions_count", event.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("form_submissions")
        .select("id", { count: "exact", head: true })
        .eq("product_id", event.id);
      if (error) throw error;
      return count ?? 0;
    },
  });

  // Fetch linked NPS form
  const { data: npsForm } = useQuery({
    queryKey: ["nps_form_for_event", event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nps_forms")
        .select("id, title, slug")
        .eq("product_id", event.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const modality = event.event_modality as keyof typeof modalityConfig | null;
  const modalityInfo = modality ? modalityConfig[modality] : null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "").replace(" de ", " "),
      full: date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const dateInfo = formatDate(event.event_date);

  const isUpcoming = event.event_date ? new Date(event.event_date) > new Date() : null;

  return (
    <>
      <div className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-200 hover:border-secondary/40">
        {/* Top accent line */}
        <div className={`h-1 w-full ${event.active ? "bg-secondary" : "bg-muted"}`} />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs font-medium border ${
                    event.active
                      ? "text-green-700 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400"
                      : "text-muted-foreground bg-muted border-border"
                  }`}
                >
                  {event.active ? "Ativo" : "Inativo"}
                </Badge>

                {modalityInfo && (
                  <Badge variant="outline" className={`text-xs font-medium border ${modalityInfo.color}`}>
                    <modalityInfo.icon className="h-3 w-3 mr-1" />
                    {modalityInfo.label}
                  </Badge>
                )}

                {isUpcoming !== null && (
                  <Badge variant="outline" className={`text-xs border ${isUpcoming ? "text-secondary border-secondary/30 bg-secondary/5" : "text-muted-foreground border-border"}`}>
                    {isUpcoming ? "Próximo" : "Realizado"}
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-foreground text-base leading-snug truncate">
                {event.name}
              </h3>
            </div>

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(event)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar evento
                </DropdownMenuItem>
                {event.slug && (
                  <DropdownMenuItem onClick={() => window.open(`/p/${event.slug}`, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver página pública
                  </DropdownMenuItem>
                )}
                {npsForm && (
                  <DropdownMenuItem onClick={() => window.open(`/nps/${npsForm.slug}`, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir pesquisa NPS
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Date & Location */}
          <div className="space-y-2 mb-4">
            {dateInfo ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0 text-secondary" />
                <span className="capitalize">{dateInfo.full}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Data não definida</span>
              </div>
            )}

            {dateInfo?.time && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{dateInfo.time}</span>
              </div>
            )}

            {event.event_location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{event.event_location}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 py-3 border-t border-border mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-secondary" />
              <span className="font-semibold text-foreground">{submissionCount ?? "–"}</span>
              <span className="text-muted-foreground">inscritos</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setAttendeesOpen(true)}
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Confirmados
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              disabled={!npsForm}
              onClick={() => npsForm && setNpsOpen(true)}
            >
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              Ver NPS
            </Button>

            {event.slug && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs col-span-2 border-secondary/30 text-secondary hover:bg-secondary/10"
                onClick={() => window.open(`/p/${event.slug}`, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Página de inscrição
              </Button>
            )}
          </div>
        </div>
      </div>

      <GrifoTalkAttendeesSheet
        open={attendeesOpen}
        onOpenChange={setAttendeesOpen}
        productId={event.id}
        productName={event.name}
      />

      {npsForm && (
        <NpsResultsSheet
          open={npsOpen}
          onOpenChange={setNpsOpen}
          form={{ id: npsForm.id, title: npsForm.title, slug: npsForm.slug }}
        />
      )}
    </>
  );
}
