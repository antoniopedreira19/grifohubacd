import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  XCircle,
  Star,
  X,
  Flame,
  Shield,
  Clock,
  Award,
  Target,
  Users,
  Zap,
  ArrowRight,
  ChevronRight,
  Diamond,
  Calendar,
  MapPin,
  Video,
  MessageCircle,
} from "lucide-react";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import webinarHeroDuo from "@/assets/webinar-hero-duo.jpg";
import danielGedeonImg from "@/assets/daniel-gedeon-obra.jpg";
import estevaoImg from "@/assets/estevao-farkasvolgyi.jpg";

interface LpWebinarNovoPadraoProps {
  product: {
    id: string;
    name: string;
    checkout_url?: string | null;
  };
}

/* ─── countdown helper ─── */
function useCountdown(targetDate: Date) {
  const calc = () => {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return time;
}

/* ─── section wrapper ─── */
const Section = ({
  children,
  className = "",
  id,
  dark = true,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}) => (
  <section
    id={id}
    className={`py-16 md:py-24 px-4 ${dark ? "bg-[#0b1c2e]" : "bg-[#f2f0ec]"} ${className}`}
  >
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

const SectionTag = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-block border border-[#a47428]/40 text-[#a47428] px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
    {children}
  </div>
);

/* ─── gold heading ─── */
const GoldHeading = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2
    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight ${className}`}
  >
    {children}
  </h2>
);

/* ─── MAIN COMPONENT ─── */
export function LpWebinarNovoPadrao({ product }: LpWebinarNovoPadraoProps) {
  useMetaPixel(product.id);

  const eventDate = useMemo(() => new Date("2026-03-18T19:30:00-03:00"), []);
  const countdown = useCountdown(eventDate);

  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [dismissedSticky, setDismissedSticky] = useState(false);

  // Checkout links — product.checkout_url as fallback
  const checkoutComum = "[LINK_CHECKOUT_COMUM]";
  const checkoutVip = "[LINK_CHECKOUT_VIP]";
  const checkoutDiamond = "[LINK_CHECKOUT_DIAMOND]";
  const ctaFallback = product.checkout_url || "#pricing-section";

  useEffect(() => {
    const h = () => {
      setShowStickyCTA(window.scrollY > 500 && !dismissedSticky);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, [dismissedSticky]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ─── ticket card ─── */
  const TicketCard = ({
    tier,
    price,
    highlighted = false,
    features,
    cta,
    link,
    badge,
  }: {
    tier: string;
    price: string;
    highlighted?: boolean;
    features: string[];
    cta: string;
    link: string;
    badge?: string;
  }) => (
    <div
      className={`relative rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-2 ${
        highlighted
          ? "bg-gradient-to-b from-[#a47428] to-[#a47428]/40 shadow-2xl shadow-[#a47428]/20"
          : "bg-[#1a2d40]"
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#a47428] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
          {badge}
        </div>
      )}
      <div
        className={`rounded-2xl p-6 md:p-8 h-full flex flex-col ${
          highlighted ? "bg-[#0f2336]" : "bg-[#0f2336]"
        }`}
      >
        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-1">
          {tier}
        </h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-xs text-gray-400">R$</span>
          <span className="text-4xl md:text-5xl font-black text-white">{price}</span>
        </div>
        <ul className="space-y-3 flex-1 mb-8">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-[#a47428] mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <a href={link} target="_blank" rel="noopener noreferrer" className="block">
          <Button
            className={`w-full font-bold uppercase tracking-wide text-sm py-6 transition-all duration-300 hover:scale-[1.02] ${
              highlighted
                ? "bg-[#a47428] hover:bg-[#8a6220] text-white shadow-lg shadow-[#a47428]/30"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            }`}
          >
            {cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1c2e] text-white overflow-x-hidden font-sans">
      {/* ════════ STICKY CTA BAR ════════ */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-[#0b1c2e]/95 backdrop-blur-md border-b border-[#a47428]/30 transition-all duration-500 ${
          showStickyCTA
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Flame className="w-5 h-5 text-[#a47428] animate-pulse shrink-0" />
            <span className="text-[#a47428] font-bold text-xs sm:text-sm uppercase tracking-wide truncate">
              18/03/2026 — Vagas limitadas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => scrollTo("pricing-section")}
              className="bg-[#a47428] hover:bg-[#8a6220] text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 uppercase tracking-wide"
            >
              Garantir Ingresso
            </Button>
            <button
              onClick={() => setDismissedSticky(true)}
              className="text-gray-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[70vh] flex items-center px-4 py-12 md:py-16">
        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1c2e] via-[#112232] to-[#0b1c2e]" />
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhNDc0MjgiIG9wYWNpdHk9IjAuNCI+PHBhdGggZD0iTTM2IDM0aDItdjJoLTJ6TTAgMzRoMnYtMkgwek0zNiAwaDJ2MmgtMnpNMCAwaDF2MkgweiIvPjwvZz48L2c+PC9zdmc+')]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <SectionTag>Webinar ao vivo · 18 de março de 2026</SectionTag>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] mb-6">
              O Novo Padrão da Construção:{" "}
              <span className="text-[#a47428]">
                Quando a Execução Vira Marca
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Dois dos maiores nomes da construção brasileira juntos, ao vivo,
              para mostrar como{" "}
              <strong className="text-white">
                parar de competir por preço e virar referência
              </strong>{" "}
              — unindo execução impecável com experiência premium do cliente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                onClick={() => scrollTo("pricing-section")}
                className="bg-[#a47428] hover:bg-[#8a6220] text-white font-black text-base sm:text-lg px-8 py-6 uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#a47428]/30"
              >
                Garantir meu ingresso
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => scrollTo("o-que-voce-vai-aprender")}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/5 text-base px-8 py-6"
              >
                Ver programação
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Info bar */}
            <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#a47428]" />
                <span>18/03/2026 · Terça · 19h30</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#a47428]" />
                <span>Online ao vivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#a47428]" />
                <span>Daniel Gedeon + Estevão Farkasvölgyi</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full aspect-[3/4] max-h-[480px] rounded-2xl overflow-hidden border border-[#a47428]/20 shadow-2xl shadow-black/40">
              <img
                src={webinarHeroDuo}
                alt="Daniel Gedeon e Estevão Farkasvölgyi"
                className="w-full h-full object-cover object-[center_35%]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2e]/60 via-transparent to-transparent" />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ════════ COUNTDOWN BAR ════════ */}
      <div className="bg-[#a47428]/10 border-y border-[#a47428]/20 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <span className="text-[#a47428] font-bold text-sm uppercase tracking-wider">
            O webinar começa em:
          </span>
          <div className="flex gap-4">
            {[
              { v: countdown.days, l: "dias" },
              { v: countdown.hours, l: "hrs" },
              { v: countdown.minutes, l: "min" },
              { v: countdown.seconds, l: "seg" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums">
                  {String(v).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ PROBLEM SECTION ════════ */}
      <Section dark={false}>
        <div className="text-center mb-12">
          <SectionTag>A realidade que ninguém fala</SectionTag>
          <GoldHeading className="text-[#0b1c2e]">
            Você está <span className="text-red-600">preso na guerra de preço</span>
            <br className="hidden sm:block" /> e sabe que não é assim que cresce
          </GoldHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: "Margem apertada, cliente pedindo desconto",
              desc: "Você fecha obra por medo de perder, mas entrega sem lucro. Cada projeto vira uma aposta.",
            },
            {
              title: "Obras que viram novela",
              desc: "Retrabalho, atraso, fornecedor que fura. Você prometeu 8 meses e está no 12º sem previsão de entrega.",
            },
            {
              title: "Dono preso na operação",
              desc: 'Você é o engenheiro, o financeiro, o comercial e o "apagador de incêndio". Sem você, a obra para.',
            },
            {
              title: "Sem diferencial real",
              desc: "Sua construtora faz o mesmo que as outras 200 da região. O cliente compara planilha e escolhe o mais barato.",
            },
            {
              title: "Equipe sem padrão",
              desc: "Cada pedreiro faz de um jeito. O acabamento depende do humor do mestre de obras.",
            },
            {
              title: '"Minha cidade é diferente"',
              desc: "Você acha que alto padrão e método só funcionam em capitais grandes. Spoiler: não.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors shrink-0">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0b1c2e] mb-1 group-hover:text-red-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0b1c2e] rounded-2xl p-8 md:p-10 text-center border-l-4 border-[#a47428]">
          <p className="text-gray-300 text-lg mb-3">
            A verdade que separa construtoras que crescem das que sobrevivem:
          </p>
          <p className="text-xl md:text-2xl font-bold text-white">
            <span className="text-[#a47428]">Diferenciação real</span> nasce da
            execução e da experiência do cliente — não do preço mais baixo.
          </p>
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => scrollTo("pricing-section")}
            className="bg-[#a47428] hover:bg-[#8a6220] text-white font-bold text-base px-10 py-6 uppercase tracking-wide hover:scale-105 transition-all duration-300"
          >
            Quero entrar no Novo Padrão
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Section>

      {/* ════════ CONVERGENCE ════════ */}
      <Section>
        <div className="text-center mb-12">
          <SectionTag>A convergência</SectionTag>
          <GoldHeading className="text-white">
            Dois mundos. <span className="text-[#a47428]">Um novo padrão.</span>
          </GoldHeading>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Pela primeira vez, dois métodos que dominam segmentos diferentes se unem
            para criar o modelo que vai redefinir construtoras no Brasil.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Grifo / Fast */}
          <div className="bg-[#112232] border border-[#a47428]/20 rounded-2xl p-8 hover:border-[#a47428]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-[#a47428]" />
              <div>
                <h3 className="font-bold text-white text-lg">
                  Método Fast Construction
                </h3>
                <p className="text-gray-400 text-sm">Daniel Gedeon · Grifo</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Performance e velocidade com padrão",
                "Gestão de obra como sistema, não improviso",
                "Processos replicáveis e escaláveis",
                "Atendimento comercial premium",
                "Prática aplicada — nada fica no papel",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#a47428] mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique */}
          <div className="bg-[#112232] border border-[#a47428]/20 rounded-2xl p-8 hover:border-[#a47428]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-[#a47428]" />
              <div>
                <h3 className="font-bold text-white text-lg">
                  Método Boutique
                </h3>
                <p className="text-gray-400 text-sm">
                  Estevão Farkasvölgyi · Boutique Construtora
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Excelência e organização milimétrica",
                "DNA de respeito ao cliente e ao prazo",
                "Modularidade e padronização inteligente",
                "Satisfação do cliente como métrica central",
                'Obras como "relógio suíço" — planejadas e executadas com precisão',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#a47428] mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            <strong className="text-white">O resultado:</strong> um modelo
            prático para construtoras que querem sair da guerra de preço e
            se tornar{" "}
            <span className="text-[#a47428] font-bold">referência</span> no seu
            mercado — com execução impecável e experiência que o cliente nunca
            esquece.
          </p>
        </div>
      </Section>

      {/* ════════ O QUE VOCÊ VAI APRENDER ════════ */}
      <Section dark={false} id="o-que-voce-vai-aprender">
        <div className="text-center mb-12">
          <SectionTag>Programação</SectionTag>
          <GoldHeading className="text-[#0b1c2e]">
            O que você vai aprender{" "}
            <span className="text-[#a47428]">neste webinar</span>
          </GoldHeading>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Posicionamento que atrai o cliente certo",
              desc: "Como nichar sua construtora e parar de brigar com 200 concorrentes pelo mesmo cliente que só olha preço.",
            },
            {
              icon: Shield,
              title: "Padrão de execução replicável",
              desc: "O sistema para garantir que toda obra entregue o mesmo nível — independente de quem está no canteiro.",
            },
            {
              icon: Star,
              title: "Experiência premium do cliente",
              desc: "Como transformar a jornada do cliente numa vantagem competitiva que gera indicação e aumenta ticket.",
            },
            {
              icon: Clock,
              title: "Previsibilidade de prazo e custo",
              desc: "Ferramentas e processos para acabar com a 'novela' de obra que nunca termina no prazo prometido.",
            },
            {
              icon: Award,
              title: "Da execução à marca",
              desc: "O caminho para sua construtora ser reconhecida como referência — não como 'mais uma'.",
            },
            {
              icon: Zap,
              title: "Crescimento sem o dono na operação",
              desc: "Como estruturar para crescer sem que cada obra dependa de você estar lá.",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-transparent hover:border-[#a47428]/30"
            >
              <div className="bg-[#a47428]/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-[#a47428]/20 transition-colors">
                <Icon className="w-6 h-6 text-[#a47428]" />
              </div>
              <h3 className="font-bold text-[#0b1c2e] mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ PARA QUEM É / NÃO É ════════ */}
      <Section>
        <div className="text-center mb-12">
          <SectionTag>Filtro de audiência</SectionTag>
          <GoldHeading className="text-white">
            Este webinar é <span className="text-[#a47428]">para você</span>?
          </GoldHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Para quem é */}
          <div className="bg-[#112232] border border-green-500/20 rounded-2xl p-8">
            <h3 className="text-green-400 font-bold text-lg mb-6 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Para quem é
            </h3>
            <ul className="space-y-4">
              {[
                "Donos e sócios de construtoras que faturam de R$2M a R$20M/ano",
                "Quem quer sair da guerra de preço e nichar",
                "Quem quer virar referência na região e não só 'mais uma construtora'",
                "Quem quer crescer sem ficar preso na operação",
                "Quem entende que execução com padrão é o que diferencia",
                "Quem está disposto a implementar, não apenas assistir",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Para quem não é */}
          <div className="bg-[#112232] border border-red-500/20 rounded-2xl p-8">
            <h3 className="text-red-400 font-bold text-lg mb-6 uppercase tracking-wide flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Para quem NÃO é
            </h3>
            <ul className="space-y-4">
              {[
                "Quem quer fórmula mágica ou resultado sem esforço",
                "Quem acha que 'na minha cidade é diferente' e não tenta",
                "Quem não tem disposição de mudar processos",
                "Quem quer apenas assistir mais um webinar sem aplicar nada",
                "Quem está satisfeito competindo por preço",
                "Iniciantes que ainda não têm empresa formada",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ════════ SPEAKERS ════════ */}
      <Section>
        <div className="text-center mb-12">
          <SectionTag>Quem apresenta</SectionTag>
          <GoldHeading className="text-white">
            Dois dos maiores nomes da{" "}
            <span className="text-[#a47428]">construção brasileira</span>
          </GoldHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Daniel */}
          <div className="bg-[#112232] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-[#a47428]/10">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={danielGedeonImg} alt="Daniel Gedeon" className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-white text-xl mb-1">
                Daniel Gedeon
              </h3>
              <p className="text-[#a47428] text-sm font-medium mb-4">
                Grifo · Fast Construction · Grifo Academy
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Referência em obras comerciais e criador do Método Fast
                Construction — gestão, performance, velocidade com padrão e
                processos que funcionam na prática. (inserir métricas reais)
              </p>
            </div>
          </div>

          {/* Estevão */}
          <div className="bg-[#112232] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-[#a47428]/10">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={estevaoImg} alt="Estevão Farkasvölgyi" className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-white text-xl mb-1">
                Estevão Farkasvölgyi
              </h3>
              <p className="text-[#a47428] text-sm font-medium mb-4">
                Boutique Construtora
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Referência em obras residenciais de altíssimo padrão. DNA de
                organização, excelência e respeito. Metodologia com
                modularidade e foco total na satisfação do cliente. (inserir métricas reais)
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════ PRICING / TICKETS ════════ */}
      <Section id="pricing-section">
        <div className="text-center mb-12">
          <SectionTag>Ingressos</SectionTag>
          <GoldHeading className="text-white">
            Escolha o nível de{" "}
            <span className="text-[#a47428]">acesso ideal</span> para você
          </GoldHeading>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            3 formas de participar. Quanto mais perto, mais resultado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 items-start">
          <TicketCard
            tier="Comum"
            price="97"
            link={checkoutComum}
            cta="Garantir ingresso"
            features={[
              "Acesso ao webinar ao vivo (18/03/2026)",
              "Conteúdo completo com Daniel + Estevão",
              "Material de apoio",
            ]}
          />

          <TicketCard
            tier="VIP"
            price="297"
            highlighted
            badge="Mais escolhido"
            link={checkoutVip}
            cta="Quero o VIP"
            features={[
              "Tudo do ingresso Comum",
              "+1 hora extra ao vivo com Daniel + Estevão",
              "Aprofundamento exclusivo e perguntas diretas",
              "Acesso à gravação completa",
              "Prioridade nas respostas",
            ]}
          />

          <TicketCard
            tier="Diamond"
            price="2.997"
            link={checkoutDiamond}
            badge="Alto impacto"
            cta="Quero o Diagnóstico"
            features={[
              "Tudo do ingresso VIP",
              "Diagnóstico individual da sua empresa (30 min com Daniel)",
              "Estratégia de diferenciação personalizada para os próximos 3 meses",
              "1 imersão presencial no Hub Grifo Academy em São Paulo",
              "Networking com construtores de todo o Brasil",
              "Caminho direto para o próximo nível de implantação",
            ]}
          />
        </div>

        {/* Comparative Table — Mobile */}
        <div className="mt-12 bg-[#112232] rounded-2xl p-6 md:p-8 border border-[#a47428]/10">
          <h3 className="text-white font-bold text-lg text-center mb-6 uppercase tracking-wide">
            Comparativo rápido
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-gray-400 font-medium">
                    Benefício
                  </th>
                  <th className="text-center py-3 text-gray-400 font-medium px-2">
                    Comum
                  </th>
                  <th className="text-center py-3 text-[#a47428] font-bold px-2">
                    VIP
                  </th>
                  <th className="text-center py-3 text-gray-400 font-medium px-2">
                    Diamond
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ["Webinar ao vivo", true, true, true],
                  ["+1h extra com mentores", false, true, true],
                  ["Gravação", false, true, true],
                  ["Diagnóstico individual (30 min)", false, false, true],
                  ["Imersão presencial no Hub SP", false, false, true],
                  ["Networking nacional", false, false, true],
                ].map(([label, c, v, d], i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 pr-4">{label as string}</td>
                    {[c, v, d].map((val, j) => (
                      <td key={j} className="text-center py-3 px-2">
                        {val ? (
                          <CheckCircle className="w-4 h-4 text-[#a47428] mx-auto" />
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* ════════ BONUS ════════ */}
      <Section dark={false}>
        <div className="text-center mb-12">
          <SectionTag>Bônus exclusivos</SectionTag>
          <GoldHeading className="text-[#0b1c2e]">
            Extras que <span className="text-[#a47428]">só VIP e Diamond</span>{" "}
            recebem
          </GoldHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#a47428]/10 hover:border-[#a47428]/40 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#a47428]/10 p-3 rounded-xl">
                <MessageCircle className="w-6 h-6 text-[#a47428]" />
              </div>
              <div>
                <span className="text-xs text-[#a47428] font-bold uppercase">
                  VIP + Diamond
                </span>
                <h3 className="font-bold text-[#0b1c2e]">
                  +1 Hora Extra ao Vivo
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Logo após o webinar, Daniel e Estevão continuam ao vivo por mais 1
              hora para aprofundar os temas, responder perguntas e fazer
              direcionamento prático para o seu cenário.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#a47428]/10 hover:border-[#a47428]/40 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#a47428]/10 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-[#a47428]" />
              </div>
              <div>
                <span className="text-xs text-[#a47428] font-bold uppercase">
                  Diamond
                </span>
                <h3 className="font-bold text-[#0b1c2e]">
                  Imersão Presencial no Hub SP
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              1 dia presencial no Hub Grifo Academy em São Paulo. Você escolhe a
              data, faz networking com construtores de todo o Brasil e vive o
              tema na prática — experiência que acelera a aplicação do conteúdo.
            </p>
          </div>
        </div>
      </Section>

      {/* ════════ OBJECTIONS ════════ */}
      <Section>
        <div className="text-center mb-12">
          <SectionTag>FAQ</SectionTag>
          <GoldHeading className="text-white">
            Perguntas <span className="text-[#a47428]">frequentes</span>
          </GoldHeading>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {[
              {
                q: "Não tenho tempo para assistir um webinar. Vale a pena?",
                a: "São poucas horas que podem mudar a direção da sua construtora. O custo de continuar fazendo igual é muito maior do que parar para recalibrar. Além disso, o ingresso VIP dá acesso à gravação.",
              },
              {
                q: "Já vi vários webinars e cursos. O que esse tem de diferente?",
                a: "Esse não é um curso genérico. São dois dos maiores nomes da construção brasileira, juntos, compartilhando método aplicado — não teoria. O foco é o que funciona na prática para construtoras de 2M a 20M/ano.",
              },
              {
                q: "Minha cidade é pequena / meu mercado é diferente. Funciona?",
                a: "Método é método. Posicionamento, padrão de execução e experiência do cliente funcionam em qualquer praça. Inclusive, cidades menores são onde mais rápido você se torna referência.",
              },
              {
                q: "Meu cliente só quer preço. Como vou cobrar mais?",
                a: "Esse é exatamente o problema que vamos resolver. Quem compete por preço atrai cliente de preço. O webinar mostra como atrair o cliente que valoriza execução, prazo e experiência.",
              },
              {
                q: "Minha equipe não vai acompanhar mudanças.",
                a: "O método foi feito para construtoras reais, com equipes reais. Não é sobre trocar todo mundo — é sobre instalar processos que funcionam com a equipe que você tem.",
              },
              {
                q: "Alto padrão é outra realidade. Não tenho como comparar.",
                a: "Você não precisa construir mansão para aplicar os princípios. Padrão, previsibilidade e experiência do cliente valem para qualquer segmento — do popular ao alto padrão.",
              },
              {
                q: "Como funciona o Diagnóstico Individual do Diamond?",
                a: "Daniel analisa o cenário da sua empresa (região, posicionamento, dores, momento) em 30 minutos de apresentação personalizada e entrega uma estratégia de diferenciação para aplicar nos próximos 3 meses.",
              },
              {
                q: "Posso parcelar?",
                a: "As condições de parcelamento estão disponíveis no checkout de cada ingresso. Clique no botão do ingresso desejado para ver as opções.",
              },
              {
                q: "Como funciona a Imersão Presencial (Diamond)?",
                a: "Você escolhe uma data disponível para ir ao Hub Grifo Academy em São Paulo. Lá, participa de um dia de conteúdo prático, networking com construtores de todo o Brasil e experiência aplicada ao tema.",
              },
              {
                q: "E se eu não puder assistir ao vivo?",
                a: "O ingresso VIP e Diamond incluem acesso à gravação. O ingresso Comum é exclusivo para o ao vivo — se não puder comparecer, considere o upgrade para VIP.",
              },
              {
                q: "Tem garantia?",
                a: "Se em até 7 dias antes do evento você sentir que não é para você, basta solicitar o reembolso pelo e-mail de suporte. Sem burocracia. [DEFINIR POLÍTICA EXATA]",
              },
              {
                q: "Por que o Diamond custa R$ 2.997?",
                a: "Porque inclui um diagnóstico personalizado com Daniel + uma imersão presencial. Juntos, esses dois extras valem mais do que o valor cobrado — são a porta para o próximo nível de implantação na sua construtora.",
              },
            ].map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-[#112232] rounded-xl border border-[#a47428]/10 px-6 hover:border-[#a47428]/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-white font-medium hover:no-underline py-5">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-5">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* ════════ SOCIAL PROOF (Placeholders) ════════ */}
      <Section dark={false}>
        <div className="text-center mb-12">
          <SectionTag>Prova social</SectionTag>
          <GoldHeading className="text-[#0b1c2e]">
            Quem já passou pelo{" "}
            <span className="text-[#a47428]">ecossistema Grifo</span>
          </GoldHeading>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">
                  ?
                </div>
                <div>
                  <p className="font-bold text-[#0b1c2e] text-sm">
                    [INSERIR NOME]
                  </p>
                  <p className="text-gray-400 text-xs">[INSERIR EMPRESA / CIDADE]</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "[INSERIR DEPOIMENTO]"
              </p>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 text-[#a47428] fill-[#a47428]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ URGENCY ════════ */}
      <Section>
        <div className="relative bg-gradient-to-br from-[#a47428]/20 to-[#a47428]/5 border border-[#a47428]/30 rounded-3xl p-8 md:p-12 text-center">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#a47428] text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full">
            Últimas vagas
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white uppercase mt-4 mb-4">
            A hora é agora.{" "}
            <span className="text-[#a47428]">18 de março de 2026.</span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Enquanto você pensa, construtores que já decidiram estão se
            posicionando no novo padrão. A meta é de 300 a 400 participantes. As
            vagas são limitadas — especialmente VIP e Diamond.
          </p>

          {/* Countdown inline */}
          <div className="flex justify-center gap-6 mb-8">
            {[
              { v: countdown.days, l: "dias" },
              { v: countdown.hours, l: "hrs" },
              { v: countdown.minutes, l: "min" },
              { v: countdown.seconds, l: "seg" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#a47428] tabular-nums">
                  {String(v).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {l}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => scrollTo("pricing-section")}
            className="bg-[#a47428] hover:bg-[#8a6220] text-white font-black text-lg px-12 py-7 uppercase tracking-wide hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-[#a47428]/30"
          >
            Garantir meu ingresso agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Section>

      {/* ════════ GUARANTEE ════════ */}
      <Section dark={false}>
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="w-12 h-12 text-[#a47428] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#0b1c2e] mb-3">
            Política de Reembolso
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Se até 7 dias antes do evento (11/03/2026) você decidir que não é
            para você, basta enviar um e-mail para{" "}
            <a href="mailto:contato@grifoacademy.com.br" className="text-[#a47428] font-medium hover:underline">
              contato@grifoacademy.com.br
            </a>{" "}
            e devolvemos 100% do valor pago. Sem perguntas, sem burocracia.
          </p>
        </div>
      </Section>

      {/* ════════ FOOTER ════════ */}
      <footer className="bg-[#071420] py-10 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-2">
            © 2026 Grifo Academy. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-[#a47428] transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-[#a47428] transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-[#a47428] transition-colors">
              Contato
            </a>
          </div>
        </div>
      </footer>

      {/* ════════ MOBILE STICKY CTA ════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1c2e]/95 backdrop-blur-md border-t border-[#a47428]/30 p-3 md:hidden">
        <Button
          onClick={() => scrollTo("pricing-section")}
          className="w-full bg-[#a47428] hover:bg-[#8a6220] text-white font-bold text-sm py-5 uppercase tracking-wide"
        >
          Ver ingressos — a partir de R$ 97
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
