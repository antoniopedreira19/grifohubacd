import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Home, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getTemplateComponent } from "@/components/templates/registry";
import { Button } from "@/components/ui/button";

export default function PublicPageRenderer() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch product by slug
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ["public-product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, page_templates(*)")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (productLoading) {
    return <LandingPageSkeleton />;
  }

  // Error or not found state
  if (productError || !product) {
    return <NotFoundPage />;
  }

  // Get template from product
  const template = product.page_templates as { component_key: string } | null;
  
  if (!template?.component_key) {
    return <NotFoundPage message="Este produto não possui um template configurado." />;
  }

  // Get the component from registry
  const TemplateComponent = getTemplateComponent(template.component_key);

  if (!TemplateComponent) {
    return <NotFoundPage message="Template não encontrado no sistema." />;
  }

  return (
    <Suspense fallback={<LandingPageSkeleton />}>
      <TemplateComponent product={product} />
    </Suspense>
  );
}

function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b1c2e] flex flex-col items-center justify-center px-6">
      <img
        src="https://storage.googleapis.com/gpt-engineer-file-uploads/GlLUnfIBasPhwDSvWDNXsfHTAWB2/uploads/1768411680869-LOGO_GRIFO_6-removebg-preview.png"
        alt=""
        className="w-[72px] h-[72px] object-contain mb-8 opacity-80"
        width={72}
        height={72}
      />
      <Skeleton className="w-[min(80%,420px)] h-7 mb-3.5 bg-[rgba(225,216,207,0.08)]" />
      <Skeleton className="w-[min(60%,300px)] h-4 mb-8 bg-[rgba(225,216,207,0.06)]" />
      <Skeleton className="w-[200px] h-12 rounded-full bg-[rgba(225,216,207,0.08)]" />
    </div>
  );
}

function NotFoundPage({ message = "Página não encontrada" }: { message?: string }) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-secondary" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-white/70 text-lg mb-8">{message}</p>
        
        <Link to="/">
          <Button 
            variant="outline" 
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            <Home className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
