import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Briefcase,
  DollarSign,
  HardHat,
  Hash,
  MapPin,
  Users,
  ClipboardList,
  User,
  Phone,
  Mail,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { CountryCodeSelect } from "@/components/ui/country-code-select";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { usePartialLeadCapture } from "@/hooks/usePartialLeadCapture";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

interface FormFunil360Props {
  productId?: string;
  productSlug?: string;
}

const REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul", "Nacional"];

const TICKET_MEDIO_OPTIONS = [
  { value: "<100k", label: "Até R$ 100 mil" },
  { value: "100k-500k", label: "Entre R$ 100 mil e R$ 500 mil" },
  { value: "500k-1M", label: "Entre R$ 500 mil e R$ 1 milhão" },
  { value: "1M-5M", label: "Entre R$ 1 milhão e R$ 5 milhões" },
  { value: "+5M", label: "Acima de R$ 5 milhões" },
];

const OBRAS_OPTIONS = [
  { value: "1", label: "Somente 1" },
  { value: "2-4", label: "Entre 2-4" },
  { value: "5-7", label: "Entre 5-7" },
  { value: "7-10", label: "Entre 7-10" },
  { value: "+10", label: "Acima de 10" },
];

const SETORES_ATUACAO = [
  "Incorporação Residencial",
  "Obras Comerciais e Corporativas",
  "Galpões e Obras Industriais",
  "Reformas de Alto Padrão",
  "Infraestrutura e Loteamentos",
  "Obras Públicas / Licitações",
];

const SETORES_EQUIPE = [
  "Engenharia / Projetos",
  "Compras / Suprimentos",
  "Financeiro / Controladoria",
  "Comercial / Vendas",
  "RH / Gestão de Pessoas",
  "Administrativo",
  "Faço tudo sozinho",
];

const CARGOS = [
  "Sócio / Proprietário",
  "Diretor de Obras",
  "Engenheiro Chefe",
  "Arquiteto Coordenador",
  "Suprimentos / Compras",
  "Outro",
];

const FATURAMENTOS = [
  { value: "<500k", label: "Até R$ 500 mil" },
  { value: "500k-1M", label: "Entre R$ 500 mil e R$ 1 mi" },
  { value: "1M-5M", label: "Entre R$ 1 mi e R$ 5 mi" },
  { value: "5M-10M", label: "Entre R$ 5 mi e R$ 10 mi" },
  { value: "10M-50M", label: "Entre R$ 10 mi e R$ 50 mi" },
  { value: "+50M", label: "Acima de R$ 50 mi" },
];

type FormData = {
  cargo: string;
  faturamento: string;
  setores_atuacao: string[];
  ticket_medio: string;
  obras_simultaneas: string;
  estado: string;
  possui_socios: string;
  setores_equipe: string[];
  full_name: string;
  phone: string;
  countryCode: string;
  email: string;
  instagram: string;
};

const INITIAL: FormData = {
  cargo: "",
  faturamento: "",
  setores_atuacao: [],
  ticket_medio: "",
  obras_simultaneas: "",
  estado: "",
  possui_socios: "",
  setores_equipe: [],
  full_name: "",
  phone: "",
  countryCode: "+55",
  email: "",
  instagram: "",
};

export default function FormFunil360({ productId, productSlug }: FormFunil360Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useMetaPixel(productId);
  const { savePartial, getPartialLeadId } = usePartialLeadCapture("Funil 360");

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [step]);

  const TOTAL = 12;
  const progress = ((step + 1) / (TOTAL + 1)) * 100;

  const set = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleMulti = (field: "setores_atuacao" | "setores_equipe", value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const mapRevenue = (r: string): number | null => {
    const m: Record<string, number> = {
      "<500k": 0, "500k-1M": 500000, "1M-5M": 1000000,
      "5M-10M": 5000000, "10M-50M": 10000000, "+50M": 50000000,
    };
    return m[r] ?? null;
  };

  // ============ STEP HANDLERS ============

  const handleCargoSelect = (cargo: string) => {
    set("cargo", cargo);
    savePartial({});
    setTimeout(() => setStep(1), 250);
  };

  const handleFaturamentoSelect = (fat: string) => {
    set("faturamento", fat);
    savePartial({ company_revenue: mapRevenue(fat) });
    setTimeout(() => setStep(2), 250);
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleContinue();
  };

  const handleContinue = () => {
    // Validate current step
    if (step === 2 && data.setores_atuacao.length === 0) {
      toast.error("Selecione ao menos um setor."); return;
    }
    if (step === 3 && !data.ticket_medio) {
      toast.error("Informe o ticket médio."); return;
    }
    if (step === 4 && !data.obras_simultaneas) {
      toast.error("Informe a quantidade de obras."); return;
    }
    if (step === 5 && !data.estado) {
      toast.error("Selecione o estado."); return;
    }
    if (step === 7 && data.setores_equipe.length === 0) {
      toast.error("Selecione ao menos um setor."); return;
    }
    if (step === 8 && data.full_name.length < 3) {
      toast.error("Digite seu nome completo."); return;
    }
    if (step === 9 && data.phone.replace(/\D/g, "").length < 10) {
      toast.error("Telefone inválido."); return;
    }
    if (step === 10 && !data.email.includes("@")) {
      toast.error("Email inválido."); return;
    }

    // Save partial on contact steps
    if (step === 8) savePartial({ full_name: data.full_name });
    if (step === 9) savePartial({ phone: `${data.countryCode}${data.phone.replace(/\D/g, "")}` });
    if (step === 10) savePartial({ email: data.email });

    if (step === 11) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const fullPhone = `${data.countryCode}${data.phone.replace(/\D/g, "")}`;
      const companyRevenue = mapRevenue(data.faturamento);
      const fbp = getCookie("_fbp") || null;
      const fbc = getCookie("_fbc") || null;

      const partialId = getPartialLeadId();
      let leadId: string;

      if (partialId) {
        const updatePayload: Record<string, unknown> = {
          full_name: data.full_name, email: data.email, phone: fullPhone,
          social_media: data.instagram, status: "Novo", fbp, fbc,
        };
        if (companyRevenue !== null) updatePayload.company_revenue = companyRevenue;
        await supabase.from("leads").update(updatePayload).eq("id", partialId);
        leadId = partialId;
      } else {
        const { data: existing } = await supabase.from("leads").select("id").eq("email", data.email).single();
        if (existing) {
          const up: Record<string, unknown> = { full_name: data.full_name, phone: fullPhone, social_media: data.instagram, fbp, fbc };
          if (companyRevenue !== null) up.company_revenue = companyRevenue;
          await supabase.from("leads").update(up).eq("id", existing.id);
          leadId = existing.id;
        } else {
          let origin: string | null = null;
          if (productId) {
            const { data: p } = await supabase.from("products").select("lead_origin, name").eq("id", productId).single();
            origin = p?.lead_origin || p?.name || null;
          }
          const ins: Record<string, unknown> = {
            full_name: data.full_name, email: data.email, phone: fullPhone,
            social_media: data.instagram, status: "Novo", origin, fbp, fbc,
          };
          if (companyRevenue !== null) ins.company_revenue = companyRevenue;
          const { data: newLead, error } = await supabase.from("leads").insert(ins).select("id").single();
          if (error) throw error;
          leadId = newLead!.id;
        }
      }

      // Form submission
      await supabase.from("form_submissions").insert({
        lead_id: leadId,
        product_id: productId,
        answers: {
          cargo: data.cargo,
          faturamento: data.faturamento,
          setores_atuacao: data.setores_atuacao,
          ticket_medio: data.ticket_medio,
          obras_simultaneas: data.obras_simultaneas,
          estado: data.estado,
          possui_socios: data.possui_socios,
          setores_equipe: data.setores_equipe,
          instagram: data.instagram,
        },
      });

      // Determine redirect based on cargo + faturamento
      const isSocio = data.cargo === "Sócio / Proprietário";
      const highRevenue = ["1M-5M", "5M-10M", "10M-50M", "+50M"].includes(data.faturamento);
      const MASTERCLASS_URL = "https://www.grifocrm.com.br/p/masterclass-o-novo-padrao-da-construcao";

      if (isSocio && highRevenue) {
        // ICP qualificado: cria deal + obrigado
        if (productId) {
          const { data: cfg } = await supabase.from("products").select("create_deal, pipeline_id, price").eq("id", productId).single();
          if (cfg?.create_deal && cfg?.pipeline_id) {
            const { data: stages } = await supabase.from("pipeline_stages").select("id").eq("pipeline_id", cfg.pipeline_id).order("order_index", { ascending: true }).limit(1);
            if (stages?.length) {
              await supabase.from("deals").insert({
                lead_id: leadId, product_id: productId, pipeline_id: cfg.pipeline_id,
                stage_id: stages[0].id, status: "open", value: cfg.price || 0, priority: "Medium",
              });
            }
          }
        }
        toast.success("Aplicação enviada com sucesso!");
        if (productSlug) navigate(`/obrigado/${productSlug}`);
        else setStep(TOTAL + 1);
      } else if (!isSocio && !highRevenue) {
        // Não sócio + baixo faturamento → vitrine
        navigate("/redirect-vitrine");
      } else {
        // Sócio + baixo faturamento OU não sócio + alto faturamento → página intermediária webinar
        navigate("/redirect-webinar");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ RENDER ============

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start md:justify-center bg-[#112232] text-[#E1D8CF] font-sans relative overflow-y-auto p-4 pb-28">
      <style>{`.funil360-scroll::-webkit-scrollbar{width:6px}.funil360-scroll::-webkit-scrollbar-track{background:transparent}.funil360-scroll::-webkit-scrollbar-thumb{background:rgba(225,216,207,0.15);border-radius:3px}.funil360-scroll::-webkit-scrollbar-thumb:hover{background:rgba(225,216,207,0.25)}`}</style>
      <div className="fixed top-0 left-0 w-full h-2 bg-[#112232] z-50">
        <div className="h-full bg-[#A47428] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="w-full max-w-2xl z-10 flex flex-col items-center pb-20 md:pb-0 pt-6">
        <div className="mb-8 md:mb-12">
          <img
            src="https://naroalxhbrvmosbqzhrb.supabase.co/storage/v1/object/public/photos-wallpapers/LOGO_GRIFO_6-removebg-preview.png"
            alt="Grifo Logo" className="h-16 md:h-24 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        <div className="w-full relative min-h-[400px]">
          {/* Step 0: Cargo */}
          {step === 0 && (
            <QCard icon={<Briefcase className="text-[#A47428]" size={32} />} n={1} q="Qual é o seu cargo atual na empresa?" sub="Selecione a opção que melhor descreve sua posição.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {CARGOS.map((c) => (
                  <OptBtn key={c} label={c} selected={data.cargo === c} onClick={() => handleCargoSelect(c)} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 1: Faturamento */}
          {step === 1 && (
            <QCard icon={<DollarSign className="text-[#A47428]" size={32} />} n={2} q="Qual o faturamento ANUAL da sua empresa?" sub="Essa informação é confidencial e usada apenas para qualificação.">
              <div className="grid grid-cols-1 gap-3 mt-4">
                {FATURAMENTOS.map((f) => (
                  <OptBtn key={f.value} label={f.label} selected={data.faturamento === f.value} onClick={() => handleFaturamentoSelect(f.value)} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 2: Setores de atuação */}
          {step === 2 && (
            <QCard icon={<HardHat className="text-[#A47428]" size={32} />} n={3} q="Em quais setores sua empresa atua?" sub="Selecione todos que se aplicam.">
              <div className="grid grid-cols-1 gap-3 mt-4">
                {SETORES_ATUACAO.map((s) => (
                  <OptBtn key={s} label={s} selected={data.setores_atuacao.includes(s)} onClick={() => toggleMulti("setores_atuacao", s)} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 3: Ticket médio */}
          {step === 3 && (
            <QCard icon={<Hash className="text-[#A47428]" size={32} />} n={4} q="Qual o ticket médio dos seus contratos?" sub="Valor aproximado em reais.">
              <div className="grid grid-cols-1 gap-3 mt-4">
                {TICKET_MEDIO_OPTIONS.map((t) => (
                  <OptBtn key={t.value} label={t.label} selected={data.ticket_medio === t.value} onClick={() => { set("ticket_medio", t.value); setTimeout(nextStep, 200); }} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 4: Obras simultâneas */}
          {step === 4 && (
            <QCard icon={<Hash className="text-[#A47428]" size={32} />} n={5} q="Quantas obras simultâneas a empresa gerencia?" sub="Número aproximado atual.">
              <div className="grid grid-cols-1 gap-3 mt-4">
                {OBRAS_OPTIONS.map((o) => (
                  <OptBtn key={o.value} label={o.label} selected={data.obras_simultaneas === o.value} onClick={() => { set("obras_simultaneas", o.value); setTimeout(nextStep, 200); }} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 5: Região de atuação */}
          {step === 5 && (
            <QCard icon={<MapPin className="text-[#A47428]" size={32} />} n={6} q="Qual a região de atuação da empresa?" sub="Selecione a região.">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {REGIOES.map((r) => (
                  <OptBtn key={r} label={r} selected={data.estado === r} onClick={() => { set("estado", r); setTimeout(nextStep, 200); }} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 6: Possui sócios */}
          {step === 6 && (
            <QCard icon={<Users className="text-[#A47428]" size={32} />} n={7} q="Você possui sócios na empresa?" sub="Sim ou Não.">
              <div className="grid grid-cols-2 gap-3 mt-4">
                {["Sim", "Não"].map((o) => (
                  <OptBtn key={o} label={o} selected={data.possui_socios === o} onClick={() => { set("possui_socios", o); setTimeout(nextStep, 200); }} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 7: Setores com equipe */}
          {step === 7 && (
            <QCard icon={<ClipboardList className="text-[#A47428]" size={32} />} n={8} q="Quais setores da empresa já possuem equipe?" sub="Selecione todos que se aplicam.">
              <div className="grid grid-cols-1 gap-3 mt-4">
                {SETORES_EQUIPE.map((s) => (
                  <OptBtn key={s} label={s} selected={data.setores_equipe.includes(s)} onClick={() => toggleMulti("setores_equipe", s)} />
                ))}
              </div>
            </QCard>
          )}

          {/* Step 8: Nome */}
          {step === 8 && (
            <QCard icon={<User className="text-[#A47428]" size={32} />} n={9} q="Qual é o seu nome completo?" sub="Queremos saber quem está falando conosco.">
              <InLine ref={inputRef} name="name" autoComplete="name" value={data.full_name} onChange={(e: any) => set("full_name", e.target.value)} onKeyDown={handleKeyDown} placeholder="Digite seu nome..." />
            </QCard>
          )}

          {/* Step 9: WhatsApp */}
          {step === 9 && (
            <QCard icon={<Phone className="text-[#A47428]" size={32} />} n={10} q="Qual seu WhatsApp para contato?" sub="Nossos especialistas entrarão em contato por aqui.">
              <div className="flex items-end gap-3">
                <CountryCodeSelect value={data.countryCode} onChange={(c) => set("countryCode", c)} variant="dark" className="flex-shrink-0" />
                <div className="flex-1">
                  <InLine ref={inputRef} name="tel" autoComplete="tel-national" value={data.phone}
                    onChange={(e: any) => set("phone", e.target.value.replace(/^\+\d{1,3}\s?/, ""))}
                    onKeyDown={handleKeyDown} placeholder="(00) 00000-0000" type="tel" />
                </div>
              </div>
            </QCard>
          )}

          {/* Step 10: Email */}
          {step === 10 && (
            <QCard icon={<Mail className="text-[#A47428]" size={32} />} n={11} q="E o seu melhor e-mail?" sub="Para envio de materiais e propostas.">
              <InLine ref={inputRef} name="email" autoComplete="email" value={data.email} onChange={(e: any) => set("email", e.target.value)} onKeyDown={handleKeyDown} placeholder="seu@empresa.com.br" type="email" />
            </QCard>
          )}

          {/* Step 11: Instagram */}
          {step === 11 && (
            <QCard icon={<Instagram className="text-[#A47428]" size={32} />} n={12} q="Qual o Instagram da construtora?" sub="Para conhecermos melhor o seu trabalho.">
              <InLine ref={inputRef} value={data.instagram} onChange={(e: any) => set("instagram", e.target.value)} onKeyDown={handleKeyDown} placeholder="@suaconstrutora" />
              {isSubmitting && (
                <div className="mt-4 flex items-center justify-center text-[#A47428]">
                  <Loader2 className="animate-spin mr-2" /> Enviando aplicação...
                </div>
              )}
            </QCard>
          )}

          {/* Success */}
          {step > TOTAL && (
            <div className="flex flex-col items-center justify-center animate-in fade-in duration-700 text-center mt-10">
              <div className="w-20 h-20 rounded-full bg-[#A47428] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(164,116,40,0.4)]">
                <Check className="text-white w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Aplicação Recebida!</h2>
              <p className="text-[#E1D8CF]/80 text-lg max-w-md">
                Nossa equipe de especialistas irá analisar seu perfil e entrará em contato via WhatsApp em breve.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step <= TOTAL && step > 0 && (
          <div className="fixed bottom-0 left-0 w-full p-6 bg-[#112232] md:bg-transparent md:static flex items-center justify-between max-w-2xl mt-8">
            <button onClick={prevStep} disabled={isSubmitting}
              className="flex items-center text-[#E1D8CF]/60 hover:text-[#A47428] transition-colors font-medium text-sm md:text-base disabled:opacity-50">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </button>

            {![0, 1, 5, 6].includes(step) && (
              <button onClick={handleContinue} disabled={isSubmitting}
                className="flex items-center bg-[#A47428] hover:bg-[#8a6120] text-white px-6 py-3 rounded-lg font-bold transition-all ml-auto shadow-lg shadow-[#A47428]/20">
                {step === 11 ? "Enviar" : "Continuar"} <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function QCard({ children, icon, n, q, sub }: any) {
  return (
    <div className="flex flex-col items-start w-full animate-in slide-in-from-right-8 duration-500 fade-in">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[#A47428] font-bold text-sm tracking-widest uppercase">Questão {n}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{q}</h2>
      {sub && <p className="text-[#E1D8CF]/60 text-lg mb-8">{sub}</p>}
      <div className="w-full">{children}</div>
    </div>
  );
}

const InLine = ({ value, onChange, placeholder, type = "text", onKeyDown, ref, autoComplete = "on", name }: any) => (
  <div className="relative w-full">
    <style>{`input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,input:-webkit-autofill:active{-webkit-box-shadow: 0 0 0 30px #112232 inset !important;-webkit-text-fill-color: #E1D8CF !important;transition: background-color 5000s ease-in-out 0s;}`}</style>
    <input ref={ref} type={type} name={name} value={value} onChange={onChange} onKeyDown={onKeyDown}
      placeholder={placeholder} spellCheck="false" autoComplete={autoComplete}
      className="w-full bg-transparent border-0 border-b-2 border-[#E1D8CF]/20 text-[#E1D8CF] text-2xl md:text-3xl py-4 focus:ring-0 focus:outline-none focus:border-[#A47428] transition-all placeholder:text-[#E1D8CF]/30 appearance-none rounded-none" />
  </div>
);

const OptBtn = ({ label, selected, onClick }: any) => (
  <button onClick={onClick}
    className={cn(
      "w-full text-left p-4 md:p-5 rounded-lg border text-lg transition-all duration-200 flex items-center justify-between group",
      selected ? "bg-[#A47428] border-[#A47428] text-white shadow-lg shadow-[#A47428]/25"
        : "bg-transparent border-[#E1D8CF]/20 text-[#E1D8CF] hover:border-[#A47428] hover:bg-[#A47428]/10"
    )}>
    <span className="font-medium">{label}</span>
    {selected ? <Check className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-[#E1D8CF]/40 group-hover:border-[#A47428]" />}
  </button>
);
