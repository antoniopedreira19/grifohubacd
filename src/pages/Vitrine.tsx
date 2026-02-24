import { useState } from "react";
import {
  LayoutGrid,
  GraduationCap,
  FileText,
  Users,
  Target,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

const products = [
  {
    id: 1,
    tag: "FERRAMENTA PRÁTICA",
    title: "Planilha de Planejamento (PCP)",
    description:
      "O fim do cronograma de parede. Tenha previsibilidade real e dite o ritmo de execução da sua obra.",
    cta: "ACESSAR PLANILHA",
    image:
      "https://images.unsplash.com/photo-1503387762-592dee58c160?q=80&w=800&auto=format&fit=crop",
    icon: <FileText size={20} />,
    url: "#",
  },
  {
    id: 2,
    tag: "FERRAMENTA PRÁTICA",
    title: "Sistema de Bonificação",
    description:
      "Alinhe os interesses da sua equipe com o lucro da empresa. Chega de pagar bônus sem ter margem.",
    cta: "ACESSAR PLANILHA",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
    icon: <Target size={20} />,
    url: "#",
  },
  {
    id: 3,
    tag: "TREINAMENTO RÁPIDO",
    title: "Webinar Grifo Academy",
    description:
      "A porta de entrada para a nossa filosofia. Insights imediatos para estancar perdas e organizar a casa.",
    cta: "ASSISTIR AGORA",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    icon: <Users size={20} />,
    url: "#",
  },
  {
    id: 4,
    tag: "TREINAMENTO PROFUNDO",
    title: "Masterclass Executiva",
    description:
      "Aulas táticas e aprofundadas sobre os maiores gargalos da gestão de obras e posicionamento comercial.",
    cta: "VER CATÁLOGO",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    icon: <GraduationCap size={20} />,
    url: "#",
  },
  {
    id: 5,
    tag: "CONSULTORIA",
    title: "Diagnóstico de Viabilidade",
    description:
      "Mapeie os gargalos da sua construtora em uma sessão estratégica 1 a 1 com um de nossos especialistas.",
    cta: "AGENDAR SESSÃO",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    icon: <LayoutGrid size={20} />,
    url: "#",
    primary: true,
  },
  {
    id: 6,
    tag: "PREMIUM",
    title: "Mentoria Grifo 360",
    description:
      "Instalação completa do nosso sistema de previsibilidade, com Setup prático direto na sua obra.",
    cta: "APLICAR PARA VAGA",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop",
    icon: <ShieldCheck size={20} />,
    url: "#",
    featured: true,
  },
];

export default function Vitrine() {
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  return (
    <div className="min-h-screen w-full bg-[#112232] text-[#E1D8CF] font-sans">
      {/* Subtle grid background */}
      <style>{`
        .grid-bg {
          background-image: radial-gradient(rgba(163, 116, 40, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .pulse-border {
          animation: pulse-gold 2s ease-in-out infinite;
        }
        @keyframes pulse-gold {
          0%, 100% { border-color: rgba(164,116,40,0.3); }
          50% { border-color: rgba(164,116,40,0.8); }
        }
      `}</style>

      {/* ─── Hero Section ─── */}
      <section className="relative grid-bg">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="https://naroalxhbrvmosbqzhrb.supabase.co/storage/v1/object/public/photos-wallpapers/LOGO_GRIFO_6-removebg-preview.png"
              alt="Grifo Logo"
              className="h-16 md:h-24 w-auto object-contain drop-shadow-2xl"
            />
          </div>

          <span className="inline-block text-[#A47428] text-xs font-bold tracking-[0.3em] uppercase mb-4 border border-[#A47428]/30 rounded-full px-4 py-1.5">
            Arsenal Estratégico
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            O Ecossistema Grifo
          </h1>

          <p className="text-lg md:text-xl text-[#E1D8CF]/60 max-w-2xl leading-relaxed">
            Ferramentas, treinamentos e mentorias para transformar você no{" "}
            <span className="text-[#A47428] font-semibold">
              Comandante da sua construtora
            </span>
            . Escolha o seu próximo passo.
          </p>

          {/* Decorative line */}
          <div className="mt-12 flex items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#A47428]/50" />
            <div className="w-2 h-2 rounded-full bg-[#A47428]/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#A47428]/50" />
          </div>
        </div>
      </section>

      {/* ─── Product Grid ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(164,116,40,0.12)] ${
                product.featured
                  ? "border-[#A47428]/50 pulse-border bg-[#0d1b29]"
                  : "border-[#E1D8CF]/10 hover:border-[#A47428]/40 bg-[#0d1b29]"
              }`}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    imgLoaded[product.id] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() =>
                    setImgLoaded((prev) => ({ ...prev, [product.id]: true }))
                  }
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1b29]" />

                {/* Tag on image */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase bg-[#A47428]/90 text-white px-2.5 py-1 rounded-md">
                    {product.tag}
                  </span>
                </div>

                {/* Icon circle */}
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#112232]/80 border border-[#A47428]/40 flex items-center justify-center text-[#A47428] backdrop-blur-sm">
                  {product.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#A47428] transition-colors leading-snug">
                  {product.title}
                </h3>
                <p className="text-sm text-[#E1D8CF]/50 leading-relaxed mb-5 flex-1">
                  {product.description}
                </p>

                {/* CTA */}
                <div
                  className={`flex items-center justify-center gap-2 text-xs font-bold tracking-wider py-2.5 rounded-lg transition-all duration-200 ${
                    product.featured
                      ? "bg-[#A47428] text-white group-hover:bg-[#b8832e]"
                      : "border border-[#A47428]/40 text-[#A47428] group-hover:bg-[#A47428]/10"
                  }`}
                >
                  {product.cta}
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* Featured indicator */}
              {product.featured && (
                <div className="absolute top-3 right-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A47428] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#A47428]" />
                  </div>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* ─── Support Section ─── */}
        <div className="mt-16 text-center border border-[#E1D8CF]/10 rounded-2xl p-8 md:p-12 bg-[#0d1b29]/60">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#A47428]/10 border border-[#A47428]/30 mb-5">
            <MessageCircle size={24} className="text-[#A47428]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Dúvida sobre qual caminho seguir?
          </h2>
          <p className="text-[#E1D8CF]/50 max-w-lg mx-auto mb-6 text-sm leading-relaxed">
            Fale com um de nossos consultores agora mesmo e entenda qual solução
            se adapta ao seu momento atual de obra.
          </p>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <MessageCircle size={16} />
            FALAR COM SUPORTE VIA WHATSAPP
          </a>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#E1D8CF]/10 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold tracking-[0.2em] text-[#A47428] mb-1">
              GRIFO ACADEMY
            </p>
            <p className="text-[10px] text-[#E1D8CF]/30">
              © {new Date().getFullYear()} • Tecnologia e Gestão de Obras
            </p>
          </div>
          <div className="flex gap-4 text-[#E1D8CF]/30 text-xs">
            <span className="hover:text-[#E1D8CF]/60 cursor-pointer transition-colors">
              Políticas
            </span>
            <span className="hover:text-[#E1D8CF]/60 cursor-pointer transition-colors">
              Termos
            </span>
            <span className="hover:text-[#E1D8CF]/60 cursor-pointer transition-colors">
              Ajuda
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
