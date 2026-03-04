import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Settings, Target, TrendingUp, Users, ArrowRight, CheckCircle2, XCircle, ShieldCheck, Zap, Lock, MessageSquare, Layers, LayoutDashboard, Star } from "lucide-react";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { useInView } from "@/hooks/useInView";
// Static images served from /public (not bundled by Vite)
const setupBackground = "/images/mentoria-360-setup-bg.jpg";
const danielGedeon = "/images/daniel-gedeon.jpg";
const grifoLogo = "/images/grifo-logo.png";

const CTA_URL = "https://www.grifocrm.com.br/p/mentoria-grifo-360";

/* ─── Animated section component ─── */
function AnimatedSection({ children, className = "", stagger = false }: { children: React.ReactNode; className?: string; stagger?: boolean }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={`${className} ${isInView ? (stagger ? "animate-stagger-in" : "animate-fade-in-up") : "opacity-0"}`}
    >
      {children}
    </div>
  );
}

export default function Mentoria360() {
  useEffect(() => {
    // Meta Pixel initialization
    const pixelId = "1336671737870979";
    if (!document.getElementById(`pixel-${pixelId}`)) {
      const script = document.createElement("script");
      script.id = `pixel-${pixelId}`;
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', '${pixelId}'); 
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
      const noscript = document.createElement("noscript");
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
      document.head.appendChild(noscript);
    } else {
      // @ts-ignore
      if (window.fbq) window.fbq("track", "PageView");
    }
  }, []);

  const handleCTAClick = () => {
    window.open(CTA_URL, "_blank");
  };

  return <div className="min-h-screen bg-[#112232] text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#112232]/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={grifoLogo} alt="Grifo" className="h-8 sm:h-10 w-auto" width={40} height={40} />
            <span className="font-disket text-lg sm:text-xl tracking-widest text-white">GRIFO ACADEMY</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-2 h-2 rounded-full bg-[#a37428] animate-pulse" />
            <button onClick={handleCTAClick} className="font-disket text-xs sm:text-sm tracking-wider bg-[#a37428] hover:bg-[#8b6322] text-white px-4 sm:px-6 py-2 sm:py-3 rounded transition-colors">
              ​Se inscreva agora
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#112232] via-[#112232] to-[#0a1520]" />
        <div className="flex-1 flex items-center relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text */}
              <AnimatedSection stagger className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#a37428]/50 bg-transparent">
                  <span className="text-sm text-[#a37428] font-semibold tracking-wide">MENTORIA GRIFO ACADEMY</span>
                </div>
                <h1 className="font-disket text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight">
                  GRIFO 360
                </h1>
                <p className="text-2xl sm:text-3xl md:text-4xl text-gray-200 leading-snug font-light">
                  Você não tem um problema de esforço. Você tem um problema de{" "}
                  <span className="text-gradient-gold italic font-normal">sistema</span>.
                </p>
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Instalamos a previsibilidade que sua construtora precisa para escalar sem o seu caos.
                </p>
                <div>
                  <Button size="lg" onClick={handleCTAClick} className="w-full sm:w-auto text-base px-8 py-4 h-auto bg-[#a37428] hover:bg-[#8b6322] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                    APLIQUE AGORA MESMO
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-4">
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Users className="w-5 h-5 text-[#a37428]" />
                    <span>Donos de Construtora com faturamento anual acima de R$ 2 milhões</span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-gray-600" />
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Users className="w-5 h-5 text-[#a37428]" />
                    <span>Mais de R$600 milhões faturados com a metodologia da Grifo</span>
                  </div>
                </div>
              </AnimatedSection>

              {/* Right: Image */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#a37428]/20 to-transparent rounded-full blur-3xl" />
                  <img src={danielGedeon} alt="Daniel Gedeon" loading="eager" fetchPriority="high" width={420} height={520} className="relative z-10 w-72 h-96 sm:w-80 sm:h-[450px] lg:w-[420px] lg:h-[520px] object-cover object-top" style={{
                    maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)"
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="relative z-10 border-t border-white/10 bg-[#0a1520]/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#a37428]" />
                <div>
                  <p className="text-xs text-gray-400">Próxima Turma:</p>
                  <p className="text-sm text-white font-medium">Março 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-[#a37428]" />
                <div>
                  <p className="text-xs text-gray-400">Formato:</p>
                  <p className="text-sm text-white font-medium">Híbrido</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#a37428]" />
                <div>
                  <p className="text-xs text-gray-400">Duração:</p>
                  <p className="text-sm text-white font-medium">3 meses</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-6 h-6 text-[#a37428]" />
                <div>
                  <p className="text-xs text-gray-400">Acesso à Plataforma:</p>
                  <p className="text-sm text-white font-medium">1 Ano</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-[#a37428]" />
                <div>
                  <p className="text-xs text-gray-400">NPS:</p>
                  <p className="text-sm text-white font-medium">97 de 100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VÍDEO - YouTube Facade */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-disket text-2xl sm:text-3xl md:text-4xl text-white font-mono">
              DESCUBRA COMO SAIR DO CAOS OPERACIONAL EM 90 DIAS
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <YouTubeFacade videoId="80GKMBz39Lg" title="Descubra como sair do caos operacional" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-disket text-2xl sm:text-3xl md:text-4xl leading-tight">
              A VERDADE QUE NINGUÉM TE CONTA SOBRE <br /> CONSTRUIR COM LUCRO.
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Muitos engenheiros acreditam que para ganhar dinheiro precisam de "mais obras". O resultado? Mais dor de
              cabeça, mais funcionários e menos margem.
            </p>
            <blockquote className="text-xl sm:text-2xl font-medium text-[#a37428] italic border-l-4 border-[#a37428] pl-6 text-left">
              "A Grifo 360 é pra quem sente que tudo depende dele, que a empresa não tem previsibilidade, e que no fim do mês ele não sabe se ganhou dinheiro ou só girou caixa."
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* FILTRO */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="font-disket text-2xl sm:text-3xl md:text-4xl text-center mb-12">
            <h2>ESTA MENTORIA É PARA VOCÊ?</h2>
          </AnimatedSection>
          <AnimatedSection stagger className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
                <span className="font-disket text-lg text-red-400">NÃO É PARA:</span>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>❌ Engenheiros CLT ou recém-formados sem obras próprias.</p>
                <p>❌ Quem acredita em "atalhos" ou milagres sem execução.</p>
                <p>❌ Se você fatura menos de R$ 2 Milhões/Ano e não quer crescer.</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <span className="font-disket text-lg text-green-400">É PARA VOCÊ:</span>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>✅ Donos de Construtora que sentem que a empresa é uma "bagunça lucrativa".</p>
                <p>✅ Quem quer sair do operacional e focar em estratégia e novos negócios.</p>
                <p>✅ Quem busca um sistema de elite para escalar para R$ 20M+ de faturamento.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 5 PILARES */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection stagger className="space-y-12">
            <h2 className="font-disket text-2xl sm:text-3xl md:text-4xl text-center">OS 5 PILARES DA GRIFO 360</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[{
                icon: Target,
                title: "PREVISIBILIDADE",
                sub: "Planejamento",
                text: "Saia do cronograma bonito que não funciona. Implemente travas de segurança reais."
              }, {
                icon: ShieldCheck,
                title: "PRAZO, CUSTO E ROTINA",
                sub: "Gestão de Obras",
                text: "Gerir por grito é amadorismo. Instale indicadores onde o lucro está escorrendo."
              }, {
                icon: BarChart3,
                title: "MARGEM REAL",
                sub: "Financeiro",
                text: "Pare de confundir caixa com lucro e comece a tomar decisões com clareza."
              }, {
                icon: TrendingUp,
                title: "MODO CEO",
                sub: "Gestão Empresarial",
                text: "Pare de apagar incêndio e tome decisões que vão mover o ponteiro da sua empresa."
              }, {
                icon: Users,
                title: "FIM DA GUERRA POR PREÇO",
                sub: "Comercial e Marketing",
                text: "Pare de brigar por migalhas. Aprenda a se posicionar como autoridade."
              }].map((module, idx) => <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#a37428]/50 transition-colors">
                    <module.icon className="w-10 h-10 text-[#a37428] mb-4" />
                    <p className="text-sm text-[#a37428] font-semibold mb-1">{module.sub}</p>
                    <h3 className="font-disket text-lg mb-3">{module.title}</h3>
                    <p className="text-gray-600">{module.text}</p>
                  </div>)}
                <div className="p-6 rounded-2xl bg-[#112232] text-white flex flex-col justify-center items-center text-center">
                  <p className="text-[#a37428] font-semibold mb-2">Mais de 25h de conteúdo</p>
                  <Button onClick={handleCTAClick} className="bg-[#a37428] hover:bg-[#8b6322] text-white">
                    QUERO ME INSCREVER
                  </Button>
                </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SETUP */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${setupBackground})` }} />
        <div className="absolute inset-0 bg-[#112232]/90" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-[#a37428] font-semibold text-lg">SETUP NA SUA OBRA</p>
            <h2 className="font-disket text-2xl sm:text-3xl md:text-4xl">O DIFERENCIAL QUE MUDA O JOGO</h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Um mentor especialista da Grifo vai estruturar o Planejamento de Elite de uma obra sua (até R$ 20M),
              montando o primeiro ciclo de controle junto com seu time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {["Planejamento Médio Prazo", "Direcionamento de Restrições", "Primeiro Planejamento de Curto Prazo"].map((item, i) => <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#a37428]/20 border border-[#a37428]/30">
                    <CheckCircle2 className="w-4 h-4 text-[#a37428]" />
                    <span className="text-white text-sm">{item}</span>
                  </div>)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-disket text-2xl sm:text-3xl md:text-4xl">
                O QUE TODOS FALAM ANTES DE <br /> ENTRAR NA MENTORIA
              </h2>
              <div className="w-20 h-1 bg-[#a37428] mx-auto mt-4" />
            </div>
            <div className="space-y-6">
              {[{
                q: "Não tenho tempo para fazer a mentoria agora.",
                a: "Sua falta de tempo é o sintoma da ausência de um sistema. Se você não tem 2h por semana para salvar seu negócio, você não tem uma empresa, tem um subemprego de luxo."
              }, {
                q: "Já fiz outros cursos e não tive resultado.",
                a: "Sua empresa não precisa de mais aulas, precisa da solução certa para agora. Enquanto cursos focam na teoria, a Grifo 360 ajusta o foco no seu momento atual. Entregamos o setup na sua obra e o acompanhamento técnico necessário para resolver seus gargalos e acelerar seus resultados."
              }, {
                q: "O investimento é adequado para mim?",
                a: "Quanto custa um erro de planejamento ou um retrabalho de R$ 50 mil? O investimento na mentoria é irrisório perto do vazamento financeiro que o caos gera hoje."
              }].map((faq, idx) => <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-200">
                    <MessageSquare className="w-6 h-6 text-[#a37428] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  </div>)}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* MENTOR */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection stagger className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#a37428]/30 to-transparent rounded-full blur-2xl" />
                <img src={danielGedeon} alt="Daniel Gedeon" loading="lazy" decoding="async" width={320} height={320} className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 object-cover object-top rounded-full border-4 border-[#a37428]/30 shadow-2xl" />
              </div>
            </div>
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-[#a37428] font-semibold">O Fundador</p>
              <h2 className="font-disket text-3xl sm:text-4xl">DANIEL GEDEON</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Daniel Gedeon é engenheiro civil e fundador da Grifo Engenharia, empresa referência na entrega rápida e
                eficiente de obras por meio do método Fast Construction. Com espírito empreendedor, iniciou a empresa
                com apenas R$ 500 e transformou desafios em oportunidades, revolucionando o mercado com inovação, gestão
                ágil e compromisso com a qualidade. Apaixonado por otimização de processos, acredita que cada minuto
                importa na construção e no crescimento dos negócios.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-[#a37428]">+R$500M</p>
                  <p className="text-sm text-gray-400">em Obras </p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-[#a37428]">+10 anos</p>
                  <p className="text-sm text-gray-400">de Experiência Real</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection stagger className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-[#a37428]" />
                  <p className="font-disket text-lg">O QUE VOCÊ LEVA:</p>
                </div>
                <div className="space-y-4">
                  {["Acesso à Plataforma Grifo 360 (1 Ano)", "6 encontros ao vivo online no Meet", "Acompanhamento de 3 meses no grupo do Whatsapp", "Setup na Sua Obra (Consultoria Individual)", "Acesso ao GrifoBoard (1 ano)", "Pack de Planilhas e Materiais Grifo", "Acesso a um encontro presencial no Grifo Hub SP"].map((item, idx) => <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>)}
                </div>
              </div>

              <div className="relative p-6 sm:p-8 rounded-2xl bg-[#112232] text-white">
                <div className="ping-urgent rounded-2xl" />
                <div className="relative z-10 text-center space-y-6 py-[60px]">
                  <h3 className="font-disket text-2xl sm:text-3xl leading-tight">AONDE VOCÊ GOSTARIA DE ESTAR EM 3 MESES?​<br /> ​</h3>
                  <p className="text-gray-300">Vagas limitadas para garantir a qualidade do Setup.</p>
                  <div className="py-4 border-t border-b border-white/10">
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Próxima Turma:</span>
                    </div>
                    <p className="font-disket text-2xl text-[#a37428]">MARÇO 2026</p>
                  </div>
                  <Button size="lg" onClick={handleCTAClick} className="w-full text-base sm:text-lg px-8 py-6 h-auto bg-[#a37428] hover:bg-[#8b6322] text-white font-semibold">
                    APLICAR PARA A MENTORIA
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={grifoLogo} alt="Grifo" className="h-8 w-auto" loading="lazy" decoding="async" width={32} height={32} />
                <span className="font-disket text-lg tracking-widest text-[#112232]">GRIFO ACADEMY</span>
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Grifo Academy. GESTÃO E PERFORMANCE NA CONSTRUÇÃO CIVIL.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>;
}
