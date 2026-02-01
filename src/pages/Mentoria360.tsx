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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Logo */}
              <motion.img 
                variants={fadeInUp}
                src={grifoLogo} 
                alt="Grifo Academy" 
                className="h-12 w-auto"
              />
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
              >
                VOCÊ NÃO TEM UM PROBLEMA DE ESFORÇO.{" "}
                <span className="text-secondary">VOCÊ TEM UM PROBLEMA DE SISTEMA.</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
              >
                Pare de apagar incêndio. A Grifo 360 instala um sistema de previsibilidade na sua construtora e realiza o Setup da sua próxima obra junto com você.
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <Button 
                  size="lg" 
                  onClick={handleCTAClick}
                  className="text-lg px-8 py-6 h-auto bg-secondary hover:bg-grifo-gold-hover text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  QUERO INSTALAR O SISTEMA GRIFO
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Daniel Photo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/30 to-transparent rounded-3xl blur-2xl" />
                <img 
                  src={danielGedeon} 
                  alt="Daniel Gedeon" 
                  className="relative z-10 w-[400px] h-[500px] object-cover object-top rounded-2xl shadow-2xl border border-secondary/20"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTEXT SECTION - The Problem */}
      <section className="py-24 bg-background relative">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzExMjIzMiI+PC9yZWN0Pgo8cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtd')" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-center text-white"
            >
              O CENÁRIO DO DONO DE CONSTRUTORA HOJE
            </motion.h2>
            
            {/* Bento Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                  <div className="relative h-full p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-secondary/30 hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <card.icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{card.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{card.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${solutionBackground})` }}
        />
        <div className="absolute inset-0 bg-background/90" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-5xl font-bold text-white"
              >
                NÃO É CURSO.{" "}
                <span className="text-secondary">É INSTALAÇÃO.</span>
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground"
              >
                Você não precisa de mais conteúdo. Você precisa de execução. Nós instalamos a rotina, o placar e os indicadores para você virar o Comandante.
              </motion.p>
            </div>
            
            {/* Three Icons */}
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: Calendar, title: "PCP", subtitle: "Ritmo e cadência." },
                { icon: BarChart3, title: "Placar", subtitle: "Gestão à vista." },
                { icon: Settings, title: "Setup", subtitle: "Mão na massa." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center space-y-4"
                >
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-grifo-gold-hover flex items-center justify-center shadow-lg shadow-secondary/30">
                    <item.icon className="w-10 h-10 text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  <p className="text-muted-foreground">{item.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5 MODULES SECTION */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-center text-foreground"
            >
              OS 5 PILARES DA REESTRUTURAÇÃO
            </motion.h2>
            
            <div className="grid gap-6 max-w-4xl mx-auto">
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
                  <div className="flex gap-6 p-6 rounded-2xl bg-background border border-border hover:border-secondary/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold">
                      {module.num}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground">{module.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{module.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* KILLER FEATURE - Setup Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${setupBackground})` }}
        />
        <div className="absolute inset-0 bg-background/85" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            {/* Floating Card with Gold Border */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-grifo-gold-hover to-secondary rounded-3xl blur opacity-75" />
              <div className="relative p-10 md:p-12 rounded-2xl bg-card border-2 border-secondary shadow-2xl">
                <div className="space-y-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    DIFERENCIAL EXCLUSIVO
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    SETUP NA SUA OBRA
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Nós não apenas ensinamos. Nós entramos no barco com você. Um especialista da Grifo vai estruturar o planejamento inicial de uma obra sua (até R$ 20M), montando a base e o primeiro ciclo de controle junto com seu time.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleCTAClick}
                    className="mt-4 text-lg px-8 py-6 h-auto"
                  >
                    QUERO MEU SETUP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF - Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-center text-white"
            >
              QUEM JÁ INSTALOU O SISTEMA
            </motion.h2>
            
            {/* Featured Quote */}
            <motion.div 
              variants={fadeInUp}
              className="max-w-3xl mx-auto text-center"
            >
              <blockquote className="text-2xl md:text-3xl font-medium text-secondary italic leading-relaxed">
                "A Grifo mudou o jogo da minha empresa. Deixei de ser tocador de obra para ser empresário."
              </blockquote>
            </motion.div>
            
            {/* Video Testimonials Grid */}
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-2xl bg-muted overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-secondary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-secondary-foreground ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-medium">Depoimento {index + 1}</p>
                      <p className="text-muted-foreground text-sm">Empresa Parceira</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MENTOR SECTION */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto"
          >
            {/* Photo */}
            <motion.div variants={fadeInUp} className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-transparent rounded-3xl blur-xl" />
                <img 
                  src={danielGedeon} 
                  alt="Daniel Gedeon" 
                  className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-secondary/20"
                />
              </div>
            </motion.div>
            
            {/* Bio */}
            <motion.div variants={fadeInUp} className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold">
                SEU MENTOR
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Daniel Gedeon
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Engenheiro e Empresário. Daniel Gedeon transformou a gestão de obras em ciência. Ele lidera com uma visão clara: transformar "tocadores de obra" em Comandantes.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 rounded-lg bg-background border border-border">
                  <span className="text-secondary font-bold">+500</span>
                  <span className="text-muted-foreground ml-2">Empresários Mentorados</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-background border border-border">
                  <span className="text-secondary font-bold">+10 anos</span>
                  <span className="text-muted-foreground ml-2">de Experiência</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Subtle gold glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              VOCÊ QUER CONTINUAR NO IMPROVISO OU{" "}
              <span className="text-secondary">QUER ENTRAR NO TRILHO?</span>
            </motion.h2>
            
            <motion.div variants={fadeInUp}>
              <Button 
                size="lg" 
                onClick={handleCTAClick}
                className="text-xl px-10 py-7 h-auto bg-secondary hover:bg-grifo-gold-hover text-secondary-foreground shadow-lg hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300"
              >
                GARANTIR MINHA VAGA AGORA
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground"
            >
              Condição Exclusiva para a Turma Atual.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <img src={grifoLogo} alt="Grifo Academy" className="h-8 w-auto opacity-70" />
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Grifo Academy. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
