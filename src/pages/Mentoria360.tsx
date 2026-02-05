import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Settings, Target, TrendingUp, Users, Play, ArrowRight, CheckCircle2, XCircle, ShieldCheck, Zap, Lock, MessageSquare, Layers, LayoutDashboard, Star } from "lucide-react";
import heroBackground from "@/assets/mentoria-360-hero-bg.jpg";
import solutionBackground from "@/assets/mentoria-360-solution-bg.jpg";
import setupBackground from "@/assets/mentoria-360-setup-bg.jpg";
import danielGedeon from "@/assets/daniel-gedeon.jpg";
import grifoLogo from "@/assets/grifo-logo.png";
const CTA_URL = "https://www.grifocrm.com.br/p/mentoria-grifo-360";
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};
const staggerContainer = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
export default function Mentoria360() {
  useEffect(() => {
    const imagesToPreload = [heroBackground, solutionBackground, setupBackground, danielGedeon];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  const handleCTAClick = () => {
    window.open(CTA_URL, "_blank");
  };
  return <div className="min-h-screen bg-[#112232] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');
        @font-face {
          font-family: 'DisketMono';
          src: url('https://fonts.cdnfonts.com/s/14107/DisketMono-Regular.woff') format('woff');
        }
        .font-disket { font-family: 'DisketMono', monospace; text-transform: uppercase; }
        .text-gradient-gold {
          background: linear-gradient(135deg, #a37428 0%, #f1c40f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .ping-urgent {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          background: #a37428;
          animation: ping-slow 2s infinite;
          z-index: -1;
        }
      `}</style>

      {/* HEADER - DARK NAVY */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#112232]/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={grifoLogo} alt="Grifo" className="h-8 sm:h-10 w-auto" />
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

      {/* SECTION 1: HERO - DARK NAVY */}
      <section className="relative min-h-screen flex flex-col pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#112232] via-[#112232] to-[#0a1520]" />
        
        {/* Main Hero Content */}
        <div className="flex-1 flex items-center relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text Content */}
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#a37428]/50 bg-transparent">
                  <span className="text-sm text-[#a37428] font-semibold tracking-wide">MENTORIA PRESENCIAL</span>
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="font-disket text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight">
                  GRIFO 360
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl text-gray-200 leading-snug font-light">
                  Estrutura e estratégia com clareza para construtoras de{' '}
                  <span className="text-gradient-gold italic font-normal">crescimento acelerado</span>
                </motion.p>
                
                <motion.p variants={fadeInUp} className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Clareza estratégica, decisões firmes e execução para sustentar crescimento com margem.
                </motion.p>
                
                <motion.div variants={fadeInUp}>
                  <Button size="lg" onClick={handleCTAClick} className="w-full sm:w-auto text-base px-8 py-4 h-auto bg-[#a37428] hover:bg-[#8b6322] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                    Aproveitar oportunidade
                  </Button>
                </motion.div>
                
                {/* Stats below button */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-4">
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Users className="w-5 h-5 text-[#a37428]" />
                    <span>Donos de Construtora com faturamento anual acima de R$ 2 milhões</span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-gray-600" />
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Users className="w-5 h-5 text-[#a37428]" />
                    <span>Mais de 500 empresários mentorados pela Grifo</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Right: Mentor Image */}
              <motion.div 
                initial={{ opacity: 0, x: 24 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.55 }} 
                className="flex justify-center lg:justify-end order-1 lg:order-2"
              >
                <div className="relative">
                  {/* Subtle glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#a37428]/20 to-transparent rounded-full blur-3xl" />
                  <img 
                    src={danielGedeon} 
                    alt="Daniel Gedeon" 
                    loading="eager" 
                    fetchPriority="high" 
                    className="relative z-10 w-72 h-96 sm:w-80 sm:h-[450px] lg:w-[420px] lg:h-[520px] object-cover object-top" 
                    style={{ 
                      maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Bottom Info Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 border-t border-white/10 bg-[#0a1520]/80 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#a37428]" />
                <div>
                  <p className="text-xs text-gray-400">Próxima Turma:</p>
                  <p className="text-sm text-white font-medium">15 de Março</p>
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
                  <p className="text-sm text-white font-medium">12 meses</p>
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
                  <p className="text-sm text-white font-medium">95 de 100</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: VÍDEO - DARK NAVY */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={fadeInUp} className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#112232] to-transparent" />
              <div className="absolute inset-0 bg-[#0a1520] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#a37428] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#a37428]/30">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-gray-300 text-lg sm:text-xl font-medium px-4">
                    DESCUBRA COMO SAIR DO CAOS OPERACIONAL EM 90 DIAS
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: MANIFESTO - WHITE */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="max-w-4xl mx-auto text-center space-y-8">
            <motion.h2 variants={fadeInUp} className="font-disket text-2xl sm:text-3xl md:text-4xl leading-tight">
              A VERDADE QUE NINGUÉM TE CONTA SOBRE <br /> CONSTRUIR COM LUCRO.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Muitos engenheiros acreditam que para ganhar dinheiro precisam de "mais obras". O resultado? Mais dor de cabeça, mais funcionários e menos margem.
            </motion.p>
            <motion.blockquote variants={fadeInUp} className="text-xl sm:text-2xl font-medium text-[#a37428] italic border-l-4 border-[#a37428] pl-6 text-left">
              "A Grifo 360 não é para quem quer aprender a construir casas, é para quem quer aprender a CONSTRUIR UMA EMPRESA que constrói casas."
            </motion.blockquote>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: FILTRO - DARK NAVY */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={fadeInUp} className="font-disket text-2xl sm:text-3xl md:text-4xl text-center mb-12">
            ESTA MENTORIA É PARA VOCÊ?
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* NÃO É PARA */}
            <motion.div variants={fadeInUp} className="p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
                <span className="font-disket text-lg text-red-400">NÃO É PARA:</span>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>❌ Engenheiros CLT ou recém-formados sem obras próprias.</p>
                <p>❌ Quem acredita em "atalhos" ou milagres sem execução.</p>
                <p>❌ Se você fatura menos de R$ 2 Milhões/Ano e não quer crescer.</p>
              </div>
            </motion.div>

            {/* É PARA VOCÊ */}
            <motion.div variants={fadeInUp} className="p-6 sm:p-8 rounded-2xl border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <span className="font-disket text-lg text-green-400">É PARA VOCÊ:</span>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>✅ Donos de Construtora que sentem que a empresa é uma "bagunça lucrativa".</p>
                <p>✅ Quem quer sair do operacional e focar em estratégia e novos negócios.</p>
                <p>✅ Quem busca um sistema de elite para escalar para R$ 20M+ de faturamento.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: 5 PILARES - WHITE */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="space-y-12">
            <motion.h2 variants={fadeInUp} className="font-disket text-2xl sm:text-3xl md:text-4xl text-center">
              OS 5 PILARES DA REESTRUTURAÇÃO
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[{
              icon: Target,
              title: "PREVISIBILIDADE",
              sub: "Planejamento Estratégico",
              text: "Saia do cronograma bonito que não funciona. Implemente travas de segurança reais."
            }, {
              icon: ShieldCheck,
              title: "O PLACAR",
              sub: "Gestão por Dados",
              text: "Gerir por grito é amadorismo. Instale indicadores onde o lucro está escorrendo."
            }, {
              icon: BarChart3,
              title: "LUCRO NO BOLSO",
              sub: "Engenharia Financeira",
              text: "Separe o CPF do CNPJ e garanta previsibilidade de caixa de 90 dias."
            }, {
              icon: TrendingUp,
              title: "MODO CEO",
              sub: "Gestão Empresarial",
              text: "Sua empresa vai rodar sem depender da sua presença física no canteiro."
            }, {
              icon: Users,
              title: "MÁQUINA COMERCIAL",
              sub: "Venda de Valor",
              text: "Pare de brigar por migalhas. Aprenda a se posicionar como autoridade."
            }].map((module, idx) => <motion.div key={idx} variants={fadeInUp} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#a37428]/50 transition-colors">
                  <module.icon className="w-10 h-10 text-[#a37428] mb-4" />
                  <p className="text-sm text-[#a37428] font-semibold mb-1">{module.sub}</p>
                  <h3 className="font-disket text-lg mb-3">{module.title}</h3>
                  <p className="text-gray-600">{module.text}</p>
                </motion.div>)}
              <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-[#112232] text-white flex flex-col justify-center items-center text-center">
                <p className="text-[#a37428] font-semibold mb-2">Mais de 40h de conteúdo</p>
                <Button onClick={handleCTAClick} className="bg-[#a37428] hover:bg-[#8b6322] text-white">
                  QUERO ME INSCREVER
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: SETUP - DARK NAVY (IMPACT SECTION) */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
        backgroundImage: `url(${setupBackground})`
      }} />
        <div className="absolute inset-0 bg-[#112232]/90" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={fadeInUp} className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-[#a37428] font-semibold text-lg">SETUP NA SUA OBRA</p>
            <h2 className="font-disket text-2xl sm:text-3xl md:text-4xl">
              O DIFERENCIAL QUE MUDA O JOGO
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Um mentor especialista da Grifo vai estruturar o Planejamento de Elite de uma obra sua (até R$ 20M), montando o primeiro ciclo de controle junto com seu time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {["Cronograma de Ataque", "Mapa de Suprimentos", "Ritual de Gestão"].map((item, i) => <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#a37428]/20 border border-[#a37428]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#a37428]" />
                  <span className="text-white text-sm">{item}</span>
                </div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: FAQ - WHITE */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <motion.h2 variants={fadeInUp} className="font-disket text-2xl sm:text-3xl md:text-4xl">
                O QUE TODOS FALAM ANTES DE <br /> ENTRAR NA MENTORIA
              </motion.h2>
              <motion.div variants={fadeInUp} className="w-20 h-1 bg-[#a37428] mx-auto mt-4" />
            </div>
            <div className="space-y-6">
              {[{
              q: "Não tenho tempo para fazer a mentoria agora.",
              a: "Sua falta de tempo é o sintoma da ausência de um sistema. Se você não tem 2h por semana para salvar seu negócio, você não tem uma empresa, tem um subemprego de luxo."
            }, {
              q: "Já fiz outros cursos e não tive resultado.",
              a: "Cursos ensinam teoria. A Grifo 360 é implementação. Nós não entregamos aulas, entregamos o Setup na sua Obra com um especialista no seu projeto."
            }, {
              q: "O investimento é adequado para mim?",
              a: "Quanto custa um erro de planejamento ou um retrabalho de R$ 50 mil? O investimento na mentoria é irrisório perto do vazamento financeiro que o caos gera hoje."
            }].map((faq, idx) => <motion.div key={idx} variants={fadeInUp} className="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-200">
                  <MessageSquare className="w-6 h-6 text-[#a37428] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8: MENTOR - DARK NAVY */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#a37428]/30 to-transparent rounded-full blur-2xl" />
                <img src={danielGedeon} alt="Daniel Gedeon" className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 object-cover object-top rounded-full border-4 border-[#a37428]/30 shadow-2xl" />
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-6 text-center lg:text-left">
              <p className="text-[#a37428] font-semibold">O Fundador</p>
              <h2 className="font-disket text-3xl sm:text-4xl">DANIEL GEDEON</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Engenheiro e Empresário. Daniel Gedeon transformou a gestão de obras em ciência. Ele lidera com uma visão clara: transformar "tocadores de obra" em Comandantes.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-[#a37428]">+500</p>
                  <p className="text-sm text-gray-400">Empresários Mentorados</p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold text-[#a37428]">+10 anos</p>
                  <p className="text-sm text-gray-400">de Experiência Real</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA - WHITE */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white text-[#112232]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Esquerda: Entregáveis */}
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-[#a37428]" />
                  <p className="font-disket text-lg">O QUE VOCÊ LEVA:</p>
                </div>
                <div className="space-y-4">
                  {["Acesso à Plataforma Grifo 360 (1 Ano)", "Setup na Sua Obra (Consultoria Individual)", "Comunidade Exclusiva de Comandantes", "Pack de Planilhas e Dashboards de Gestão", "Encontros Estratégicos ao Vivo Quinzenais"].map((item, idx) => <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>)}
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#a37428]/10 border border-[#a37428]/30">
                  <Zap className="w-5 h-5 text-[#a37428] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 italic">
                    "Ao entrar para a Mentoria, você recebe o acesso imediato à plataforma de treinamento e o agendamento da sua consultoria de Setup."
                  </p>
                </div>
              </motion.div>

              {/* Direita: Card Urgente */}
              <motion.div variants={fadeInUp} className="relative p-6 sm:p-8 rounded-2xl bg-[#112232] text-white">
                <div className="ping-urgent rounded-2xl" />
                <div className="relative z-10 text-center space-y-6">
                  <h3 className="font-disket text-2xl sm:text-3xl leading-tight">
                    ESTE É O SEU <br /> ÚLTIMO AVISO.
                  </h3>
                  <p className="text-gray-300">Vagas limitadas para garantir a qualidade do Setup.</p>

                  <div className="py-4 border-t border-b border-white/10">
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Próxima Turma:</span>
                    </div>
                    <p className="font-disket text-2xl text-[#a37428]">15 DE MARÇO</p>
                  </div>

                  <Button size="lg" onClick={handleCTAClick} className="w-full text-base sm:text-lg px-8 py-6 h-auto bg-[#a37428] hover:bg-[#8b6322] text-white font-semibold">
                    APLICAR PARA A MENTORIA
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Pagamento 100% Seguro</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={grifoLogo} alt="Grifo" className="h-8 w-auto" />
                <span className="font-disket text-lg tracking-widest text-[#112232]">
                  GRIFO 360
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Grifo Boutique. TRANSFORMANDO TOCADORES EM COMANDANTES.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>;
}