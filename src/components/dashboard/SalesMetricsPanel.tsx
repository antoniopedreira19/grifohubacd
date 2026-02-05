import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, PhoneOff, Calendar, Trophy, XCircle, Activity, Filter, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";

interface Pipeline {
  id: string;
  name: string;
}

interface DealRow {
  calls_answered: number | null;
  calls_missed: number | null;
  status: string | null;
  meeting_date: string | null;
  pipeline_id: string | null;
  created_at: string | null;
}

type PeriodFilter = "7" | "15" | "30";

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
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [allDeals, setAllDeals] = useState<DealRow[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>("30");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pipelinesData }, { data: dealsData }] = await Promise.all([
          supabase.from("pipelines").select("id, name").eq("archived", false),
          supabase.from("deals").select("calls_answered, calls_missed, status, meeting_date, pipeline_id, created_at"),
        ]);

        setPipelines(pipelinesData || []);
        setAllDeals(dealsData || []);
      } catch (error) {
        console.error("Error fetching sales metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const cutoff = subDays(new Date(), Number(selectedPeriod)).toISOString();
    // Exclude orphan deals (pipeline_id = null) and filter by period
    const withPipeline = allDeals.filter(
      (d) => d.pipeline_id !== null && d.created_at && d.created_at >= cutoff
    );
    const filtered = selectedPipeline === "all"
      ? withPipeline
      : withPipeline.filter((d) => d.pipeline_id === selectedPipeline);

    const callsAnswered = filtered.reduce((sum, d) => sum + (d.calls_answered || 0), 0);
    const callsMissed = filtered.reduce((sum, d) => sum + (d.calls_missed || 0), 0);
    const meetingsScheduled = filtered.filter((d) => d.meeting_date).length;
    const meetingsSent = meetingsScheduled;
    const dealsWon = filtered.filter((d) => d.status === "won").length;
    const dealsLost = filtered.filter((d) => d.status === "lost").length;

    return { callsAnswered, callsMissed, meetingsScheduled, meetingsSent, dealsWon, dealsLost };
  }, [allDeals, selectedPipeline, selectedPeriod]);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#A47428]" />
              Painel Comercial
            </CardTitle>
            <CardDescription className="text-[#E1D8CF]/60">
              Indicadores de atividade do time
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as PeriodFilter)}>
              <SelectTrigger className="w-[140px] bg-[#112232] border-[#A47428]/20 text-white">
                <Clock className="w-4 h-4 mr-2 text-[#A47428]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#112232] border-[#A47428]/20">
                <SelectItem value="7" className="text-white">Últimos 7 dias</SelectItem>
                <SelectItem value="15" className="text-white">Últimos 15 dias</SelectItem>
                <SelectItem value="30" className="text-white">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
              <SelectTrigger className="w-[180px] bg-[#112232] border-[#A47428]/20 text-white">
                <Filter className="w-4 h-4 mr-2 text-[#A47428]" />
                <SelectValue placeholder="Pipeline" />
              </SelectTrigger>
              <SelectContent className="bg-[#112232] border-[#A47428]/20">
                <SelectItem value="all" className="text-white">Todos os Pipelines</SelectItem>
                {pipelines.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-white">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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