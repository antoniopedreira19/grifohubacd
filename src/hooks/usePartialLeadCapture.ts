import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook para captura progressiva de leads.
 * Salva dados parciais silenciosamente (fire-and-forget) a cada troca de etapa.
 * Não bloqueia a UI, não mostra toasts, e faz fallback gracioso se falhar.
 */
export function usePartialLeadCapture(origin: string) {
  const partialLeadIdRef = useRef<string | null>(null);

  /**
   * Salva parcialmente os dados do lead. Fire-and-forget.
   * Na primeira chamada, cria o lead com status "Parcial".
   * Nas chamadas seguintes, atualiza o lead existente.
   */
  const savePartial = useCallback(
    (data: {
      full_name?: string;
      email?: string;
      phone?: string;
      company_revenue?: number | null;
      fbp?: string | null;
      fbc?: string | null;
    }) => {
      const doSave = async () => {
        try {
          if (!partialLeadIdRef.current) {
            // First save: create partial lead
            const { data: newLead, error } = await supabase
              .from("leads")
              .insert({
                full_name: data.full_name || null,
                email: data.email || null,
                phone: data.phone || null,
                origin,
                status: "Parcial",
                company_revenue: data.company_revenue ?? undefined,
                fbp: data.fbp ?? undefined,
                fbc: data.fbc ?? undefined,
              })
              .select("id")
              .single();

            if (error) throw error;
            if (newLead) {
              partialLeadIdRef.current = newLead.id;
            }
          } else {
            // Subsequent saves: update existing partial lead
            const updateData: Record<string, unknown> = {};
            if (data.full_name) updateData.full_name = data.full_name;
            if (data.email) updateData.email = data.email;
            if (data.phone) updateData.phone = data.phone;
            if (data.company_revenue !== undefined && data.company_revenue !== null) {
              updateData.company_revenue = data.company_revenue;
            }
            if (data.fbp !== undefined) updateData.fbp = data.fbp;
            if (data.fbc !== undefined) updateData.fbc = data.fbc;

            if (Object.keys(updateData).length > 0) {
              await supabase
                .from("leads")
                .update(updateData)
                .eq("id", partialLeadIdRef.current);
            }
          }
        } catch (err) {
          // Silently log — never block UI
          console.error("[PartialLeadCapture] silent error:", err);
        }
      };

      // Fire-and-forget
      doSave();
    },
    [origin]
  );

  /**
   * Returns the partial lead ID if one was created, so the final submit
   * can update instead of insert.
   */
  const getPartialLeadId = useCallback(() => partialLeadIdRef.current, []);

  return { savePartial, getPartialLeadId };
}
