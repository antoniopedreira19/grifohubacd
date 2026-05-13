import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as XLSX from "xlsx";
import {
  Users,
  Search,
  Download,
  Phone,
  Eye,
  Trash2,
  Loader2,
  UserX,
  ArrowUpDown,
  Filter,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getRegionByPhone, getRegionColor } from "@/lib/ddd-regions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewLeadDialog } from "@/components/leads/NewLeadDialog";
import { LeadDetailSheet } from "@/components/leads/LeadDetailSheet";

interface Lead {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  origin: string | null;
  ltv: number | null;
  company_revenue: number | null;
  created_at: string | null;
  sales?: {
    product_id: string | null;
    product_name: string | null;
  }[];
}

const ITEMS_PER_PAGE = 50;

const statusColors: Record<string, string> = {
  Novo: "bg-blue-100 text-blue-800",
  Cliente: "bg-green-100 text-green-800",
  Arquivado: "bg-gray-100 text-gray-800",
};

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [answersFilters, setAnswersFilters] = useState<Record<string, string[]>>({});

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead | "created_at";
    direction: "asc" | "desc";
  }>({ key: "created_at", direction: "desc" });

  const queryClient = useQueryClient();

  // 1. Busca os Leads
  const { data: leadsData, isLoading: isLoadingLeads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, sales(product_id, product_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  // 2. Busca a lista de Produtos
  const { data: productsData } = useQuery({
    queryKey: ["products-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: submissionsData } = useQuery({
    queryKey: ["form-submissions-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("lead_id, product_id, answers, submitted_at")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data as Array<{ lead_id: string | null; product_id: string | null; answers: Record<string, any>; submitted_at: string | null }>;
    },
  });

  const flattenValue = (v: any): string => {
    if (v === null || v === undefined) return "";
    if (Array.isArray(v)) return v.map((x) => String(x)).join("; ");
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  const answersFieldsForProduct = (() => {
    if (!submissionsData) return null;
    const BLACKLIST = new Set([
      "nome", "name", "nome_completo", "fullname", "full_name",
      "email", "e_mail", "mail",
      "telefone", "whatsapp", "phone", "celular", "fone",
      "empresa", "company", "nome_empresa", "company_name", "razao_social", "razaosocial",
      "instagram", "insta", "ig", "instagram_handle",
      "investment_commitment", "investmentcommitment", "compromisso_investimento", "comprometimento_investimento",
    ]);
    const isBlacklisted = (k: string) => BLACKLIST.has(k.toLowerCase().replace(/[\s-]/g, "_"));
    const fields: Record<string, Set<string>> = {};
    for (const s of submissionsData) {
      if (!s.answers) continue;
      if (productFilter !== "all" && s.product_id !== productFilter) continue;
      for (const [k, v] of Object.entries(s.answers)) {
        if (isBlacklisted(k)) continue;
        if (!fields[k]) fields[k] = new Set();
        if (Array.isArray(v)) v.forEach((x) => x !== null && x !== undefined && String(x).trim() !== "" && fields[k].add(String(x)));
        else if (v !== null && v !== undefined && String(v).trim() !== "") fields[k].add(String(v));
      }
    }
    return fields;
  })();

  const submissionsByLead = (() => {
    const map = new Map<string, any[]>();
    if (!submissionsData) return map;
    for (const s of submissionsData) {
      if (!s.lead_id) continue;
      if (!map.has(s.lead_id)) map.set(s.lead_id, []);
      map.get(s.lead_id)!.push(s);
    }
    return map;
  })();

  const activeAnswerFiltersCount = Object.values(answersFilters).filter((arr) => arr && arr.length > 0).length;

  const toggleAnswerValue = (field: string, value: string) => {
    setAnswersFilters((prev) => {
      const cur = prev[field] || [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      const updated = { ...prev, [field]: next };
      if (next.length === 0) delete updated[field];
      return updated;
    });
    setCurrentPage(1);
  };

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      // Fecha o sheet se o lead excluído estava selecionado
      if (selectedLead?.id === deletedId) {
        setSheetOpen(false);
        setSelectedLead(null);
      }
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir lead: " + error.message);
    },
  });

  const handleSort = (key: keyof Lead) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Lógica de Filtragem e Ordenação
  const filteredAndSortedLeads =
    leadsData
      ?.filter((lead) => {
        const query = searchQuery.toLowerCase();
        const queryDigits = searchQuery.replace(/\D/g, "");
        const leadPhone = lead.phone?.replace(/\D/g, "") || "";
        
        // Se busca contém apenas números (2+ dígitos), pesquisa por telefone (inclusive últimos dígitos)
        const isPhoneSearch = /^\d+$/.test(queryDigits) && queryDigits.length >= 2;
        const matchesPhone = isPhoneSearch && leadPhone.endsWith(queryDigits);
        
        const matchesSearch =
          lead.full_name?.toLowerCase().includes(query) || 
          lead.email?.toLowerCase().includes(query) ||
          matchesPhone;

        const matchesProduct = productFilter === "all" || lead.sales?.some((sale) => sale.product_id === productFilter);

        const leadState = getRegionByPhone(lead.phone)?.state;
        const matchesRegion = regionFilter === "all" || leadState === regionFilter;

        let matchesAnswers = true;
        if (activeAnswerFiltersCount > 0) {
          const subs = (submissionsByLead.get(lead.id) || []).filter(
            (s: any) => productFilter === "all" || s.product_id === productFilter,
          );
          matchesAnswers = subs.some((sub: any) => {
            return Object.entries(answersFilters).every(([field, selected]) => {
              if (!selected || selected.length === 0) return true;
              const val = sub.answers?.[field];
              if (val === undefined || val === null) return false;
              if (Array.isArray(val)) return val.some((x) => selected.includes(String(x)));
              return selected.includes(String(val));
            });
          });
        }

        return matchesSearch && matchesProduct && matchesRegion && matchesAnswers;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        // --- CORREÇÃO AQUI: Uso de localeCompare para strings (resolve o bug dos acentos) ---
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue, "pt-BR")
            : bValue.localeCompare(aValue, "pt-BR");
        }
        // ------------------------------------------------------------------------------------

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }) || [];

  // Extrai estados únicos dos leads para o filtro
  const uniqueStates = [...new Set(
    leadsData
      ?.map((lead) => getRegionByPhone(lead.phone)?.state)
      .filter((state): state is string => !!state)
  )].sort();

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredAndSortedLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const handleExportXLSX = () => {
    if (!filteredAndSortedLeads.length) {
      toast.error("Nenhum lead para exportar");
      return;
    }

    const productNameById = new Map<string, string>();
    productsData?.forEach((p: any) => productNameById.set(p.id, p.name));

    const includedProductIds: string[] =
      productFilter !== "all"
        ? [productFilter]
        : Array.from(new Set((submissionsData || []).map((s) => s.product_id).filter(Boolean) as string[]));

    const exportLeadIds = new Set(filteredAndSortedLeads.map((l) => l.id));
    const fieldsByProduct = new Map<string, string[]>();
    for (const pid of includedProductIds) {
      const set = new Set<string>();
      (submissionsData || []).forEach((s) => {
        if (s.product_id !== pid) return;
        if (!s.lead_id || !exportLeadIds.has(s.lead_id)) return;
        Object.keys(s.answers || {}).forEach((k) => set.add(k));
      });
      if (set.size > 0) fieldsByProduct.set(pid, Array.from(set));
    }

    // submissionsData is already ordered desc by submitted_at
    const latestSubByLeadProduct = new Map<string, Record<string, any>>();
    (submissionsData || []).forEach((s) => {
      if (!s.lead_id || !s.product_id) return;
      const key = `${s.lead_id}::${s.product_id}`;
      if (!latestSubByLeadProduct.has(key)) latestSubByLeadProduct.set(key, s.answers || {});
    });

    const data = filteredAndSortedLeads.map((lead) => {
      const regionInfo = getRegionByPhone(lead.phone);
      const row: Record<string, any> = {
        Nome: lead.full_name || "",
        Email: lead.email || "",
        Telefone: lead.phone || "",
        Estado: regionInfo?.state || "-",
        LTV: lead.ltv || 0,
        Status: lead.status || "",
        Origem: lead.origin || "",
        Cadastro: lead.created_at ? format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR }) : "",
      };
      for (const [pid, fields] of fieldsByProduct.entries()) {
        const answers = latestSubByLeadProduct.get(`${lead.id}::${pid}`) || {};
        const prefix = productFilter !== "all" ? "" : `${productNameById.get(pid) || "Produto"} — `;
        for (const f of fields) {
          row[`${prefix}${f}`] = flattenValue(answers[f]);
        }
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `leads_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("XLSX exportado com sucesso!");
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold text-primary">Base de Leads</h1>
          {/* Badge com Contagem de Leads */}
          <Badge variant="secondary" className="ml-2 text-sm px-2 py-0.5 rounded-full border border-secondary/30">
            {filteredAndSortedLeads.length}
          </Badge>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select
            value={productFilter}
            onValueChange={(value) => {
              setProductFilter(value);
              setAnswersFilters({});
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por produto" />
              </div>
            </SelectTrigger>
            <SelectContent className="min-w-[--radix-select-trigger-width]">
              <SelectItem value="all">Todos os produtos</SelectItem>
              {productsData?.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {answersFieldsForProduct && Object.keys(answersFieldsForProduct).length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                Filtros de respostas
                {activeAnswerFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">{activeAnswerFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0" align="start">
              <div className="flex items-center justify-between p-3 border-b">
                <span className="text-sm font-semibold">Filtrar por respostas</span>
                {activeAnswerFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7" onClick={() => { setAnswersFilters({}); setCurrentPage(1); }}>
                    Limpar
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[420px]">
                <div className="p-3 space-y-4">
                  {Object.entries(answersFieldsForProduct)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([field, valuesSet]) => {
                      const values = Array.from(valuesSet).sort((a, b) => a.localeCompare(b, "pt-BR"));
                      const selected = answersFilters[field] || [];
                      return (
                        <div key={field} className="space-y-2">
                          <div className="text-xs font-semibold uppercase text-muted-foreground">{field}</div>
                          <div className="space-y-1.5">
                            {values.map((v) => (
                              <label key={v} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded">
                                <Checkbox
                                  checked={selected.includes(v)}
                                  onCheckedChange={() => toggleAnswerValue(field, v)}
                                />
                                <span className="flex-1">{v}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}

        <div className="w-full md:w-[160px]">
          <Select
            value={regionFilter}
            onValueChange={(value) => {
              setRegionFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="whitespace-nowrap">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Estado" />
              </div>
            </SelectTrigger>
            <SelectContent className="min-w-[--radix-select-trigger-width]">
              <SelectItem value="all">Todos</SelectItem>
              {uniqueStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportXLSX}>
            <Download className="h-4 w-4 mr-2" />
            XLSX
          </Button>
          <NewLeadDialog />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card">
        {isLoadingLeads ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAndSortedLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UserX className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum lead encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery || productFilter !== "all" || regionFilter !== "all"
                ? "Tente ajustar sua busca ou filtros."
                : "Comece adicionando seu primeiro lead clicando no botão 'Novo Lead'."}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Nome Ordenável */}
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("full_name")}
                  >
                    <div className="flex items-center gap-1">
                      Nome
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortConfig.key === "full_name" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                  </TableHead>

                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Região</TableHead>

                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("ltv")}
                  >
                    <div className="flex items-center gap-1">
                      LTV
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortConfig.key === "ltv" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                  </TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-1">
                      Cadastro
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortConfig.key === "created_at" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                  </TableHead>

                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.map((lead) => {
                  const regionInfo = getRegionByPhone(lead.phone);
                  return (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(lead)}
                  >
                    <TableCell className="font-semibold">{lead.full_name || "Sem nome"}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.email || "-"}</TableCell>
                    <TableCell>
                      {lead.phone ? (
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 hover:underline"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{lead.phone}</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Coluna Região */}
                    <TableCell>
                      {regionInfo ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className={`${getRegionColor(regionInfo.region)} cursor-default`}>
                                {regionInfo.isInternational ? "🌍 Int" : regionInfo.state}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{regionInfo.stateName} - {regionInfo.region}</p>
                              {regionInfo.ddd && <p className="text-xs text-muted-foreground">DDD: {regionInfo.ddd}</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    <TableCell className="font-medium text-foreground">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(lead.ltv || 0)}
                    </TableCell>

                    <TableCell>
                      <Badge className={statusColors[lead.status || "Novo"]}>{lead.status || "Novo"}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.created_at
                        ? format(new Date(lead.created_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(lead);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Lead</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir <strong>{lead.full_name}</strong>? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={(e) => { e.stopPropagation(); deleteLead.mutate(lead.id); }}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center py-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => {
                      if (page === "ellipsis-start" || page === "ellipsis-end") {
                        return (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page as number)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <LeadDetailSheet lead={selectedLead} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
