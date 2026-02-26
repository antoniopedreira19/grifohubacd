import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function RedirectVitrine() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#112232] text-[#E1D8CF] font-sans p-6">
      {/* Logo */}
      <div className="mb-10">
        <img
          src="https://naroalxhbrvmosbqzhrb.supabase.co/storage/v1/object/public/photos-wallpapers/LOGO_GRIFO_6-removebg-preview.png"
          alt="Grifo Logo"
          className="h-16 md:h-24 w-auto object-contain drop-shadow-2xl"
        />
      </div>

      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
          A MENTORIA GRIFO 360 NÃO É O SEU{" "}
          <span className="text-[#A47428]">PRÓXIMO PASSO.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#E1D8CF]/70 max-w-xl mb-6 leading-relaxed">
          Analisamos o seu perfil e, neste momento da sua jornada, a implementação do nosso sistema avançado não traria o retorno do seu investimento esperado para sua construtora nesse momento.
        </p>

        <p className="text-base md:text-lg text-[#E1D8CF]/60 max-w-xl mb-6 leading-relaxed">
          A Mentoria 360 foi desenhada exclusivamente para donos de construtoras que já possuem uma operação rodando, faturamento estabelecido e precisam de um sistema validado para escalar a empresa.
        </p>

        <p className="text-base md:text-lg text-[#E1D8CF]/60 max-w-xl mb-6 leading-relaxed">
          Tentar aplicar essas ferramentas avançadas agora seria pular etapas. O seu foco principal hoje deve ser{" "}
          <strong className="text-[#E1D8CF]/90">
            dominar os fundamentos da gestão de obras, precificação e processos essenciais.
          </strong>
        </p>

        {/* Highlight Box */}
        <div className="border border-[#A47428]/30 bg-[#A47428]/5 rounded-xl p-6 md:p-8 max-w-xl mb-10">
          <p className="text-[#E1D8CF]/80 text-base md:text-lg leading-relaxed">
            Para você se preparar para essa nova etapa, o ideal são nossos treinamentos focados na base da construção civil. Assim você estrutura seu negócio para, no futuro, estar pronto para escalar com previsibilidade.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/vitrine")}
          className="inline-flex items-center gap-3 bg-[#A47428] hover:bg-[#8a6120] text-white px-10 py-5 rounded-xl font-bold text-lg md:text-xl transition-all shadow-[0_0_40px_rgba(164,116,40,0.3)] hover:shadow-[0_0_60px_rgba(164,116,40,0.5)] cursor-pointer"
        >
          ACESSAR OS TREINAMENTOS <ArrowRight size={22} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-16 pb-6 text-center text-[#E1D8CF]/30 text-xs">
        © {new Date().getFullYear()} Grifo Engenharia. Todos os direitos reservados.
      </div>
    </div>
  );
}
