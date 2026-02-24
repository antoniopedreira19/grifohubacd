import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

interface VitrineProduct {
  id: string;
  name: string;
  price: number | null;
  checkout_url: string | null;
}

export default function Vitrine() {
  const [products, setProducts] = useState<VitrineProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, checkout_url")
        .eq("active", true)
        .eq("is_event", false)
        .not("checkout_url", "is", null)
        .order("name");
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#112232] text-[#E1D8CF] font-sans">
      {/* Header */}
      <div className="w-full flex justify-center pt-10 pb-6">
        <img
          src="https://naroalxhbrvmosbqzhrb.supabase.co/storage/v1/object/public/photos-wallpapers/LOGO_GRIFO_6-removebg-preview.png"
          alt="Grifo Logo"
          className="h-16 md:h-24 w-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl px-6 py-10 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
          A MENTORIA GRIFO 360<br />
          <span className="text-[#A47428]">NÃO É O SEU PRÓXIMO PASSO.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#E1D8CF]/70 max-w-2xl mb-4 leading-relaxed">
          Analisamos o seu perfil e, neste momento da sua jornada, a implementação do nosso sistema avançado de gestão não traria o retorno esperado.
        </p>

        <p className="text-base md:text-lg text-[#E1D8CF]/60 max-w-2xl mb-10 leading-relaxed">
          A Mentoria 360 é um programa intensivo desenhado para donos de construtoras com uma operação já rodando e um faturamento estabelecido. Avançar sem essa base pode comprometer o aproveitamento do método.
        </p>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-[#A47428] mb-10" />

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
          Mas a sua jornada com a Grifo não acaba aqui.
        </h2>
        <p className="text-base md:text-lg text-[#E1D8CF]/60 max-w-xl mb-10 leading-relaxed">
          Para você se preparar para essa nova etapa, o ideal são nossos treinamentos focados na base da construção civil.
        </p>

        {/* Product Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#A47428] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {products.map((product) => (
              <a
                key={product.id}
                href={product.checkout_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between border border-[#E1D8CF]/10 rounded-xl p-6 bg-[#0d1b29] hover:border-[#A47428]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(164,116,40,0.15)]"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#A47428] transition-colors">
                    {product.name}
                  </h3>
                  {product.price && (
                    <p className="text-[#A47428] font-semibold text-xl mb-4">
                      R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[#A47428] text-sm font-medium mt-auto pt-4 border-t border-[#E1D8CF]/10">
                  <span>Saiba mais</span>
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-[#E1D8CF]/40 py-10">Nenhum produto disponível no momento.</p>
        )}
      </div>

      {/* Footer */}
      <div className="py-10 text-center text-[#E1D8CF]/30 text-xs">
        © {new Date().getFullYear()} Grifo Engenharia. Todos os direitos reservados.
      </div>
    </div>
  );
}
