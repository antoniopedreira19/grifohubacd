import { ArrowRight } from "lucide-react";

export default function RedirectWebinar() {
  const MASTERCLASS_URL = "https://www.grifocrm.com.br/p/masterclass-o-novo-padrao-da-construcao";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#112232] text-[#E1D8CF] font-sans p-6">
      {/* Logo */}
      <div className="mb-10">
        <img
          src="https://naroalxhbrvmosbqzhrb.supabase.co/storage/v1/object/public/photos-wallpapers/LOGO_GRIFO_6-removebg-preview.png"
          alt="Grifo Logo"
          className="h-16 md:h-24 w-auto object-contain drop-shadow-2xl"
          loading="lazy"
          decoding="async"
          width={96}
          height={96}
        />
      </div>

      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
          ANTES DE AVANÇAR, VOCÊ PRECISA{" "}
          <span className="text-[#A47428]">DOMINAR A BASE DO SISTEMA.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#E1D8CF]/70 max-w-xl mb-6 leading-relaxed">
          O seu perfil mostra que você está no caminho certo, mas pular direto para a Mentoria 360 agora seria um erro estratégico.
        </p>

        <p className="text-base md:text-lg text-[#E1D8CF]/60 max-w-xl mb-6 leading-relaxed">
          Neste momento, o seu foco não deve ser uma reestruturação complexa, mas sim dominar os fundamentos da nossa metodologia.
        </p>

        <p className="text-base md:text-lg text-[#E1D8CF]/60 max-w-xl mb-10 leading-relaxed">
          Nossas Masterclass são a porta de entrada oficial para a filosofia de gestão da Grifo. É o ambiente onde entregamos insights práticos e imediatos que você já pode aplicar amanhã mesmo para estancar as perdas, organizar a casa e mudar a realidade da sua empresa.
        </p>

        {/* Highlight Box */}
        <div className="border border-[#A47428]/30 bg-[#A47428]/5 rounded-xl p-6 md:p-8 max-w-xl mb-10">
          <p className="text-[#E1D8CF]/80 text-base md:text-lg leading-relaxed">
            Confira nossa próxima data e participe. Ele vai te dar a clareza necessária para colocar a casa em ordem e preparar sua empresa para o próximo nível.
          </p>
        </div>

        {/* CTA Button */}
        <a
          href={MASTERCLASS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#A47428] hover:bg-[#8a6120] text-white px-10 py-5 rounded-xl font-bold text-lg md:text-xl transition-all shadow-[0_0_40px_rgba(164,116,40,0.3)] hover:shadow-[0_0_60px_rgba(164,116,40,0.5)] animate-pulse hover:animate-none"
        >
          PARTICIPE AGORA <ArrowRight size={22} />
        </a>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-16 pb-6 text-center text-[#E1D8CF]/30 text-xs">
        © {new Date().getFullYear()} Grifo Engenharia. Todos os direitos reservados.
      </div>
    </div>
  );
}
