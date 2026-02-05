import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Pipeline {
  id: string;
  name: string;
}

interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
  pipeline_id: string;
}

interface Deal {
  id: string;
  stage_id: string | null;
  value: number | null;
  status: string | null;
  pipeline_id: string | null;
}

interface FunnelStage {
  name: string;
  count: number;
  value: number;
  passRate: number | null;
  order_index: number;
}

const FUNNEL_COLORS = [
  "#A47428", // Gold - top
  "#C4943C",
  "#D4A84C",
  "#E4BC5C",
  "#F4D06C",
  "#78909C", // Gray tones for lower stages
  "#607D8B",
  "#546E7A",
];

export function PipelineFunnel() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pipelinesData }, { data: stagesData }, { data: dealsData }] = await Promise.all([
          supabase.from("pipelines").select("id, name").eq("archived", false),
          supabase.from("pipeline_stages").select("id, name, order_index, pipeline_id"),
          supabase.from("deals").select("id, stage_id, value, status, pipeline_id"),
        ]);

        setPipelines(pipelinesData || []);
        setStages(stagesData || []);
        setDeals(dealsData || []);

        // Select first pipeline by default
        if (pipelinesData && pipelinesData.length > 0 && !selectedPipeline) {
          setSelectedPipeline(pipelinesData[0].id);
        }
      } catch (error) {
        console.error("Error fetching funnel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const funnelData = useMemo((): FunnelStage[] => {
    if (!selectedPipeline) return [];

    // Get stages for selected pipeline
    const pipelineStages = stages
      .filter((s) => s.pipeline_id === selectedPipeline)
      .sort((a, b) => a.order_index - b.order_index);

    // Get active deals for selected pipeline
    const pipelineDeals = deals.filter(
      (d) => d.pipeline_id === selectedPipeline && d.status !== "lost" && d.status !== "abandoned"
    );

    // Calculate counts and values per stage
    const stageData = pipelineStages.map((stage) => {
      const stageDeals = pipelineDeals.filter((d) => d.stage_id === stage.id);
      return {
        name: stage.name,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0),
        passRate: null as number | null,
        order_index: stage.order_index,
      };
    });

    // Calculate pass rates (from previous stage to current)
    for (let i = 1; i < stageData.length; i++) {
      const prevCount = stageData[i - 1].count;
      const currCount = stageData[i].count;
      if (prevCount > 0) {
        stageData[i].passRate = (currCount / prevCount) * 100;
      }
    }

    return stageData;
  }, [selectedPipeline, stages, deals]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
      value
    );
  };

  const totalDeals = funnelData.reduce((sum, s) => sum + s.count, 0);
  const totalValue = funnelData.reduce((sum, s) => sum + s.value, 0);

  if (loading) {
    return (
      <Card className="shadow-sm border-[#A47428]/20 bg-[#1E3A50]/50">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse text-[#E1D8CF]/60">Carregando funil...</div>
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
              <TrendingDown className="h-5 w-5 text-[#A47428]" />
              Funil de Vendas
            </CardTitle>
            <CardDescription className="text-[#E1D8CF]/60">
              Taxa de passagem entre estágios
            </CardDescription>
          </div>

          <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
            <SelectTrigger className="w-[180px] bg-[#112232] border-[#A47428]/20 text-white">
              <Filter className="w-4 h-4 mr-2 text-[#A47428]" />
              <SelectValue placeholder="Selecionar Pipeline" />
            </SelectTrigger>
            <SelectContent className="bg-[#112232] border-[#A47428]/20">
              {pipelines.map((pipeline) => (
                <SelectItem key={pipeline.id} value={pipeline.id} className="text-white">
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {funnelData.length > 0 ? (
          <div className="space-y-0">
            {/* Summary badges */}
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-[#A47428]/20 text-[#A47428] border-0 px-3 py-1">
                {totalDeals} deals ativos
              </Badge>
              <Badge className="bg-white/10 text-white border-0 px-3 py-1">
                {formatCurrency(totalValue)} no funil
              </Badge>
            </div>

            {/* Funnel visualization */}
            <div className="relative">
              {funnelData.map((stage, index) => {
                // Calculate width percentage (first stage = 100%, decreasing)
                const maxCount = Math.max(...funnelData.map((s) => s.count), 1);
                const widthPercent = Math.max((stage.count / maxCount) * 100, 20);
                const color = FUNNEL_COLORS[index % FUNNEL_COLORS.length];

                return (
                  <div key={stage.name} className="relative">
                    {/* Pass rate indicator between stages */}
                    {index > 0 && stage.passRate !== null && (
                      <div className="flex items-center justify-center py-1">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#112232] border border-[#A47428]/20">
                          <svg
                            className="w-3 h-3 text-[#A47428]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <span className="text-xs font-medium text-[#A47428]">
                            {stage.passRate.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Stage bar */}
                    <div
                      className="relative mx-auto transition-all duration-500 ease-out"
                      style={{ width: `${widthPercent}%` }}
                    >
                      <div
                        className="relative flex items-center justify-between px-4 py-3 rounded-lg mb-1 overflow-hidden group hover:scale-[1.02] transition-transform cursor-default"
                        style={{
                          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Stage name and count */}
                        <div className="flex items-center gap-2 z-10">
                          <span className="font-semibold text-white text-sm truncate max-w-[120px]">
                            {stage.name}
                          </span>
                          <Badge className="bg-white/20 text-white border-0 text-xs">
                            {stage.count}
                          </Badge>
                        </div>

                        {/* Value */}
                        <span className="font-bold text-white text-sm z-10 whitespace-nowrap">
                          {formatCurrency(stage.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="p-4 bg-white/5 rounded-full">
              <TrendingDown className="h-8 w-8 text-[#E1D8CF]/20" />
            </div>
            <p className="text-sm text-[#E1D8CF]/40 font-medium">
              {selectedPipeline ? "Nenhum deal neste pipeline" : "Selecione um pipeline"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
