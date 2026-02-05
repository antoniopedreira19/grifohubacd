import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Pipeline {
  id: string;
  name: string;
}

interface LossReasonData {
  reason: string;
  count: number;
}

interface LossReasonsChartProps {
  globalPeriod?: string;
}

function periodToDays(period: string): number | null {
  if (period === "7d") return 7;
  if (period === "15d") return 15;
  if (period === "30d") return 30;
  if (period === "90d") return 90;
  return null; // "all"
}

const BAR_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#A47428",
  "#78909C",
  "#607D8B",
  "#546E7A",
  "#455A64",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#112232] border border-[#A47428]/30 p-3 rounded-lg shadow-xl min-w-[140px]">
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        <p className="text-sm text-red-400">
          {payload[0].value} {payload[0].value === 1 ? "deal" : "deals"}
        </p>
      </div>
    );
  }
  return null;
};

export function LossReasonsChart({ globalPeriod = "all" }: LossReasonsChartProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string>("all");
  const [lostDeals, setLostDeals] = useState<{ loss_reason: string | null; pipeline_id: string | null; created_at: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pipelinesData }, { data: dealsData }] = await Promise.all([
          supabase.from("pipelines").select("id, name").eq("archived", false),
          supabase.from("deals").select("loss_reason, pipeline_id, created_at").eq("status", "lost"),
        ]);

        setPipelines(pipelinesData || []);
        setLostDeals(dealsData || []);
      } catch (error) {
        console.error("Error fetching loss reasons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = useMemo((): LossReasonData[] => {
    const days = periodToDays(globalPeriod);
    const byPeriod = days
      ? lostDeals.filter((d) => d.created_at && d.created_at >= subDays(new Date(), days).toISOString())
      : lostDeals;
    const filtered = selectedPipeline === "all"
      ? byPeriod
      : byPeriod.filter((d) => d.pipeline_id === selectedPipeline);

    const reasonMap = new Map<string, number>();
    filtered.forEach((deal) => {
      const reason = deal.loss_reason?.trim() || "Não informado";
      reasonMap.set(reason, (reasonMap.get(reason) || 0) + 1);
    });

    return Array.from(reasonMap.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [lostDeals, selectedPipeline, globalPeriod]);

  const totalLost = chartData.reduce((sum, d) => sum + d.count, 0);

  if (loading) {
    return (
      <Card className="shadow-sm border-[#A47428]/20 bg-[#1E3A50]/50">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse text-[#E1D8CF]/60">Carregando motivos...</div>
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
              <ThumbsDown className="h-5 w-5 text-red-400" />
              Motivos de Perda
            </CardTitle>
            <CardDescription className="text-[#E1D8CF]/60">
              Por que estamos perdendo deals
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-4">
            <Badge className="bg-red-500/20 text-red-400 border-0 px-3 py-1">
              {totalLost} deals perdidos
            </Badge>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#E1D8CF", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="reason"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#E1D8CF", fontSize: 11 }}
                    width={130}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="p-4 bg-white/5 rounded-full">
              <ThumbsDown className="h-8 w-8 text-[#E1D8CF]/20" />
            </div>
            <p className="text-sm text-[#E1D8CF]/40 font-medium">
              Nenhum deal perdido registrado
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}