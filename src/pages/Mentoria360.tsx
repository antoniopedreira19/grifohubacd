import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  BarChart3, 
  Settings, 
  Target, 
  TrendingUp, 
  Users,
  Play,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import heroBackground from "@/assets/mentoria-360-hero-bg.jpg";
import solutionBackground from "@/assets/mentoria-360-solution-bg.jpg";
import setupBackground from "@/assets/mentoria-360-setup-bg.jpg";
import danielGedeon from "@/assets/daniel-gedeon.jpg";
import grifoLogo from "@/assets/grifo-logo.png";

const CTA_URL = "https://www.grifocrm.com.br/p/mentoria-grifo-360";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Mentoria360() {
  // Preload images on mount
  useEffect(() => {
    const imagesToPreload = [heroBackground, solutionBackground, setupBackground, danielGedeon];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleCTAClick = () => {
    window.open(CTA_URL, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent lg:block hidden" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 lg:py-20">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Daniel Photo + Text - Mobile First (appears first on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              className="lg:hidden flex flex-col items-center gap-4 w-full"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-secondary/40 to-transparent rounded-2xl blur-xl" />
                <img 
                  src={danielGedeon} 
                  alt="Daniel Gedeon" 
                  loading="eager"
                  fetchPriority="high"
                  className="relative z-10 w-48 h-60 sm:w-56 sm:h-72 object-cover object-top rounded-xl shadow-2xl border-2 border-secondary/30"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-base sm:text-lg font-bold text-white">Daniel Gedeon</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Engenheiro Civil e Mentor de Construtoras
                </p>
                <p className="text-xs text-secondary font-medium">
                  +150 construtoras mentoradas
                </p>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-5 sm:space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              {/* Logo */}
              <motion.img 
                variants={fadeInUp}
                src={grifoLogo} 
                alt="Grifo Academy" 
                className="h-10 sm:h-12 w-auto mx-auto lg:mx-0"
              />
              
              <motion.h1 
                variants={fadeInUp}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white"
              >
                VOCÊ NÃO TEM UM PROBLEMA DE ESFORÇO.{" "}
                <span className="text-secondary">VOCÊ TEM UM PROBLEMA DE SISTEMA.</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed"
              >
                Pare de apagar incêndio. A Grifo 360 instala um sistema de previsibilidade na sua construtora e realiza o Setup da sua próxima obra junto com você.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="pt-2">
                <Button 
                  size="lg" 
                  onClick={handleCTAClick}
                  className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto bg-secondary hover:bg-grifo-gold-hover text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  QUERO INSTALAR O SISTEMA GRIFO
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Daniel Photo + Text - Desktop (hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0 }}
              className="hidden lg:flex items-center gap-8"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/30 to-transparent rounded-3xl blur-2xl" />
                <img 
                  src={danielGedeon} 
                  alt="Daniel Gedeon" 
                  loading="eager"
                  fetchPriority="high"
                  className="relative z-10 w-[320px] h-[400px] object-cover object-top rounded-2xl shadow-2xl border border-secondary/20"
                />
              </div>
              <div className="space-y-3 max-w-[200px]">
                <p className="text-lg font-bold text-white">Daniel Gedeon</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Engenheiro Civil e Mentor de Construtoras. Fundador da Grifo Academy.
                </p>
                <p className="text-xs text-secondary font-medium">
                  +150 construtoras mentoradas
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTEXT SECTION - The Problem */}
      <section className="py-16 sm:py-20 lg:py-24 bg-background relative">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzExMjIzMiI+PC9yZWN0Pgo8cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtd')" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8 sm:space-y-10 lg:space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white px-2"
            >
              O CENÁRIO DO DONO DE CONSTRUTORA HOJE
            </motion.h2>
            
            {/* Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "O Herói Cansado",
                  text: "Tudo depende de você. Se você sai, a obra para.",
                  icon: Users
                },
                {
                  title: "Cegueira Financeira",
                  text: "Você vê dinheiro girando, mas não sabe sua margem real. Confunde caixa com lucro.",
                  icon: TrendingUp
                },
                {
                  title: "Gestão por Sensação",
                  text: "Sem dados, você decide no 'feeling' e vive sendo surpreendido por atrasos.",
                  icon: Target
                }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group relative"
                >
                  {/* Glassmorphism Card */}
                  <div className="relative h-full p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-xl border border-secondary/30 hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 space-y-3 sm:space-y-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-secondary/20 flex items-center justify-center">
                        <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{card.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{card.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${solutionBackground})` }}
        />
        <div className="absolute inset-0 bg-background/90" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-10 sm:space-y-12 lg:space-y-16"
          >
            <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto px-2">
              <motion.h2 
                variants={fadeInUp}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              >
                NÃO É CURSO.{" "}
                <span className="text-secondary">É INSTALAÇÃO.</span>
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-base sm:text-lg lg:text-xl text-muted-foreground"
              >
                Você não precisa de mais conteúdo. Você precisa de execução. Nós instalamos a rotina, o placar e os indicadores para você virar o Comandante.
              </motion.p>
            </div>
            
            {/* Three Icons */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: Calendar, title: "PCP", subtitle: "Ritmo e cadência." },
                { icon: BarChart3, title: "Placar", subtitle: "Gestão à vista." },
                { icon: Settings, title: "Setup", subtitle: "Mão na massa." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center space-y-2 sm:space-y-4"
                >
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary to-grifo-gold-hover flex items-center justify-center shadow-lg shadow-secondary/30">
                    <item.icon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{item.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5 MODULES SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8 sm:space-y-10 lg:space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground"
            >
              OS 5 PILARES DA REESTRUTURAÇÃO
            </motion.h2>
            
            <div className="grid gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto">
              {[
                {
                  num: "1",
                  title: "PLANEJAMENTO (PCP + Previsibilidade)",
                  text: "Saia do cronograma bonito que não funciona. Implemente travas de segurança e uma rotina de planejamento que vira execução real."
                },
                {
                  num: "2",
                  title: "GESTÃO DE OBRA (Placar + Checagem)",
                  text: "Comande a obra com placar. Pare de gerir por grito e comece a cobrar por dado. Saiba onde o prazo estoura antes de acontecer."
                },
                {
                  num: "3",
                  title: "FINANCEIRO (Centros de Custo)",
                  text: "Separe o 'bolo da obra' do 'bolo da empresa'. Tenha previsibilidade de caixa de 90 dias e pare de se enganar com o extrato bancário."
                },
                {
                  num: "4",
                  title: "GESTÃO EMPRESARIAL (Painel do Dono)",
                  text: "Saia do operacional e assuma o papel de CEO. Tenha um painel com os únicos 7 números que importam para a direção do negócio."
                },
                {
                  num: "5",
                  title: "COMERCIAL & MARKETING (Diferenciação)",
                  text: "Pare de brigar por preço e virar commodity. Aprenda a nichar, se diferenciar e vender valor para ter previsibilidade de contratos."
                }
              ].map((module, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="flex gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-background border border-border hover:border-secondary/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold">
                      {module.num}
                    </div>
                    <div className="space-y-1 sm:space-y-2 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground leading-tight">{module.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{module.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* KILLER FEATURE - Setup Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${setupBackground})` }}
        />
        <div className="absolute inset-0 bg-background/85" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            {/* Floating Card with Gold Border */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-grifo-gold-hover to-secondary rounded-2xl sm:rounded-3xl blur opacity-75" />
              <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl sm:rounded-2xl bg-card border-2 border-secondary shadow-2xl">
                <div className="space-y-4 sm:space-y-6 text-center">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/20 text-secondary text-xs sm:text-sm font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    DIFERENCIAL EXCLUSIVO
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    SETUP NA SUA OBRA
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    Nós não apenas ensinamos. Nós entramos no barco com você. Um especialista da Grifo vai estruturar o planejamento inicial de uma obra sua (até R$ 20M), montando a base e o primeiro ciclo de controle junto com seu time.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleCTAClick}
                    className="w-full sm:w-auto mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto"
                  >
                    QUERO MEU SETUP
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF - Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8 sm:space-y-10 lg:space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white"
            >
              QUEM JÁ INSTALOU O SISTEMA
            </motion.h2>
            
            {/* Featured Quote */}
            <motion.div 
              variants={fadeInUp}
              className="max-w-3xl mx-auto text-center px-2"
            >
              <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-secondary italic leading-relaxed">
                "A Grifo mudou o jogo da minha empresa. Deixei de ser tocador de obra para ser empresário."
              </blockquote>
            </motion.div>
            
            {/* Video Testimonials Grid */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto"
            >
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl sm:rounded-2xl bg-muted overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-secondary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <p className="text-white font-medium text-sm sm:text-base">Depoimento {index + 1}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">Empresa Parceira</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MENTOR SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center max-w-5xl mx-auto"
          >
            {/* Photo - First on mobile */}
            <motion.div variants={fadeInUp} className="order-1 lg:order-1">
              <div className="relative max-w-xs sm:max-w-sm mx-auto lg:max-w-md">
                <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-secondary/20 to-transparent rounded-2xl sm:rounded-3xl blur-xl" />
                <img 
                  src={danielGedeon} 
                  alt="Daniel Gedeon" 
                  className="relative z-10 w-full rounded-xl sm:rounded-2xl shadow-2xl border border-secondary/20"
                />
              </div>
            </motion.div>
            
            {/* Bio */}
            <motion.div variants={fadeInUp} className="order-2 lg:order-2 space-y-4 sm:space-y-5 lg:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/20 text-secondary text-xs sm:text-sm font-semibold">
                SEU MENTOR
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Daniel Gedeon
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Engenheiro e Empresário. Daniel Gedeon transformou a gestão de obras em ciência. Ele lidera com uma visão clara: transformar "tocadores de obra" em Comandantes.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-background border border-border">
                  <span className="text-secondary font-bold text-sm sm:text-base">+500</span>
                  <span className="text-muted-foreground ml-1.5 sm:ml-2 text-xs sm:text-sm">Empresários Mentorados</span>
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-background border border-border">
                  <span className="text-secondary font-bold text-sm sm:text-base">+10 anos</span>
                  <span className="text-muted-foreground ml-1.5 sm:ml-2 text-xs sm:text-sm">de Experiência</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
        {/* Subtle gold glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 sm:w-80 lg:w-96 h-32 sm:h-40 lg:h-48 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-2"
            >
              VOCÊ QUER CONTINUAR NO IMPROVISO OU{" "}
              <span className="text-secondary">QUER ENTRAR NO TRILHO?</span>
            </motion.h2>
            
            <motion.div variants={fadeInUp}>
              <Button 
                size="lg" 
                onClick={handleCTAClick}
                className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-8 sm:px-10 py-6 sm:py-7 h-auto bg-secondary hover:bg-grifo-gold-hover text-secondary-foreground shadow-lg hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300"
              >
                GARANTIR MINHA VAGA AGORA
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp}
              className="text-sm sm:text-base text-muted-foreground"
            >
              Condição Exclusiva para a Turma Atual.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:flex-row md:justify-between">
              <img src={grifoLogo} alt="Grifo Academy" className="h-6 sm:h-8 w-auto opacity-70" />
              <p className="text-muted-foreground text-xs sm:text-sm text-center">
                © {new Date().getFullYear()} Grifo Academy. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
