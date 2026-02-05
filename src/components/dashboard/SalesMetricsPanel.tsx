import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, PhoneOff, Calendar, Trophy, XCircle, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Metrics {
  callsAnswered: number;
  callsMissed: number;
  meetingsScheduled: number;
  meetingsSent: number;
  dealsWon: number;
  dealsLost: number;
}

function MetricRow({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#112232]/60 hover:bg-[#112232] transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <span className="text-sm text-[#E1D8CF]/80 font-medium">{label}</span>
      </div>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  );
}

export function SalesMetricsPanel() {
  const [metrics, setMetrics] = useState<Metrics>({
    callsAnswered: 0,
    callsMissed: 0,
    meetingsScheduled: 0,
    meetingsSent: 0,
    dealsWon: 0,
    dealsLost: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data: deals } = await supabase
          .from("deals")
          .select("calls_answered, calls_missed, status, meeting_date, stage_id");

        if (!deals) return;

        const callsAnswered = deals.reduce((sum, d) => sum + (d.calls_answered || 0), 0);
        const callsMissed = deals.reduce((sum, d) => sum + (d.calls_missed || 0), 0);

        // Meetings scheduled = deals that have a meeting_date set
        const meetingsScheduled = deals.filter((d) => d.meeting_date).length;

        // Meetings "sent" = deals in meeting-type stages (we count deals with meeting_date that are not open anymore or just all with meeting_date)
        // For simplicity, meetingsSent = same as meetingsScheduled (can be refined later)
        const meetingsSent = meetingsScheduled;

        const dealsWon = deals.filter((d) => d.status === "won").length;
        const dealsLost = deals.filter((d) => d.status === "lost").length;

        setMetrics({
          callsAnswered,
          callsMissed,
          meetingsScheduled,
          meetingsSent,
          dealsWon,
          dealsLost,
        });
      } catch (error) {
        console.error("Error fetching sales metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const totalCalls = metrics.callsAnswered + metrics.callsMissed;
  const callRate = totalCalls > 0 ? ((metrics.callsAnswered / totalCalls) * 100).toFixed(0) : "0";

  const totalDeals = metrics.dealsWon + metrics.dealsLost;
  const winRate = totalDeals > 0 ? ((metrics.dealsWon / totalDeals) * 100).toFixed(0) : "0";

  if (loading) {
    return (
      <Card className="shadow-sm border-[#A47428]/20 bg-[#1E3A50]/50">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse text-[#E1D8CF]/60">Carregando métricas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-[#A47428]/20 bg-[#1E3A50]/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#A47428]" />
          Painel Comercial
        </CardTitle>
        <CardDescription className="text-[#E1D8CF]/60">
          Indicadores de atividade do time
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Ligações */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A47428]">
              Ligações
            </h4>
            <span className="text-xs text-[#E1D8CF]/50">
              Taxa: {callRate}% atendidas
            </span>
          </div>
          <div className="space-y-1.5">
            <MetricRow
              icon={Phone}
              label="Atendidas"
              value={metrics.callsAnswered}
              color="text-emerald-400"
              bgColor="bg-emerald-500/10"
            />
            <MetricRow
              icon={PhoneOff}
              label="Não Atendidas"
              value={metrics.callsMissed}
              color="text-red-400"
              bgColor="bg-red-500/10"
            />
          </div>
        </div>

        {/* Reuniões */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A47428]">
            Reuniões
          </h4>
          <div className="space-y-1.5">
            <MetricRow
              icon={Calendar}
              label="Agendadas"
              value={metrics.meetingsScheduled}
              color="text-blue-400"
              bgColor="bg-blue-500/10"
            />
            <MetricRow
              icon={Calendar}
              label="Enviadas"
              value={metrics.meetingsSent}
              color="text-sky-400"
              bgColor="bg-sky-500/10"
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A47428]">
              Resultado
            </h4>
            <span className="text-xs text-[#E1D8CF]/50">
              Win Rate: {winRate}%
            </span>
          </div>
          <div className="space-y-1.5">
            <MetricRow
              icon={Trophy}
              label="Ganhos"
              value={metrics.dealsWon}
              color="text-emerald-400"
              bgColor="bg-emerald-500/10"
            />
            <MetricRow
              icon={XCircle}
              label="Perdidos"
              value={metrics.dealsLost}
              color="text-red-400"
              bgColor="bg-red-500/10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
