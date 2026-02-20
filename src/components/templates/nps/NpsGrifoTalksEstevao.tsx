import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NpsTemplateProps } from "./types";
import grifoLogo from "@/assets/grifo-logo.png";

interface FormData {
  name: string;
  phone: string;
  participation_type: "presencial" | "online" | null;
  nps_score: number | null;
  // Grade ratings (1–5) for 5 aspects
  aspect_relevance: number | null;
  aspect_depth: number | null;
  aspect_applicability: number | null;
  aspect_facilitation: number | null;
  aspect_experience: number | null;
  insight: string;
  next_step: "sim" | "talvez" | "nao" | null;
}

const initialFormData: FormData = {
  name: "",
  phone: "",
  participation_type: null,
  nps_score: null,
  aspect_relevance: null,
  aspect_depth: null,
  aspect_applicability: null,
  aspect_facilitation: null,
  aspect_experience: null,
  insight: "",
  next_step: null,
};

const ASPECTS = [
  {
    key: "aspect_relevance" as keyof FormData,
    label: "O quanto o tema discutido é atual, estratégico e conectado aos desafios que você vive hoje.",
  },
  {
    key: "aspect_depth" as keyof FormData,
    label: "Profundidade da conversa, nível das provocações e qualidade das perspectivas apresentadas.",
  },
  {
    key: "aspect_applicability" as keyof FormData,
    label: "O quanto você saiu com ideias aplicáveis, direcionamentos claros ou ajustes possíveis na sua empresa.",
  },
  {
    key: "aspect_facilitation" as keyof FormData,
    label: "Clareza na condução, capacidade de provocar a mesa e equilíbrio da conversa.",
  },
  {
    key: "aspect_experience" as keyof FormData,
    label: "Sua percepção do Talks como experiência: formato, dinâmica, ambiente e valor gerado.",
  },
];

const STEPS = ["profile", "nps", "aspects", "feedback"] as const;
type Step = typeof STEPS[number];

function ScoreButton({ value, selected, onClick }: { value: number; selected: boolean; onClick: () => void }) {
  const getColor = (v: number) => {
    if (v <= 6) return selected ? "bg-red-500 border-red-500 text-white" : "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30";
    if (v <= 8) return selected ? "bg-yellow-500 border-yellow-500 text-white" : "bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30";
    return selected ? "bg-green-500 border-green-500 text-white" : "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30";
  };
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "aspect-square rounded-xl border-2 flex items-center justify-center",
        "text-base md:text-lg font-bold transition-all duration-200",
        getColor(value)
      )}
    >
      {value}
    </motion.button>
  );
}

function AspectRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-white/80 text-sm leading-relaxed">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <motion.button
            key={v}
            onClick={() => onChange(v)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-200",
              value === v
                ? "bg-secondary border-secondary text-secondary-foreground"
                : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
            )}
          >
            {v}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function NpsGrifoTalksEstevao({ form }: NpsTemplateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("nps_responses").insert({
        form_id: form.id,
        score: formData.nps_score ?? 0,
        feedback: JSON.stringify(formData),
      });
      if (error) throw error;
    },
    onSuccess: () => setIsSubmitted(true),
    onError: (error) => {
      console.error("Error submitting NPS:", error);
      toast.error("Erro ao enviar resposta. Tente novamente.");
    },
  });

  const canProceed = (): boolean => {
    const step = STEPS[currentStep];
    switch (step) {
      case "profile":
        return formData.participation_type !== null;
      case "nps":
        return formData.nps_score !== null;
      case "aspects":
        return (
          formData.aspect_relevance !== null &&
          formData.aspect_depth !== null &&
          formData.aspect_applicability !== null &&
          formData.aspect_facilitation !== null &&
          formData.aspect_experience !== null
        );
      case "feedback":
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const update = (patch: Partial<FormData>) => setFormData((prev) => ({ ...prev, ...patch }));

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A1C2F] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-secondary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Obrigado!</h1>
          <p className="text-white/70 text-lg mb-4">
            A gente leva essas conversas a sério.
          </p>
          <p className="text-white/60 text-base">
            Sua resposta vai ajudar a gente a evoluir a experiência e o nível das próximas mesas.
          </p>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    const step = STEPS[currentStep];

    if (step === "profile") {
      return (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <p className="text-secondary text-sm font-medium mb-2 uppercase tracking-wider">
              Grifo Talks — Sua experiência
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {form.title || "Grifo Talks — Sua experiência"}
            </h1>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-md mx-auto">
              {form.description || "A gente leva essas conversas a sério. Sua resposta ajuda a gente a evoluir a experiência e o nível das próximas mesas. Leva menos de 1 minuto."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white text-sm">Nome (opcional)</Label>
              <Input
                value={formData.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Seu nome"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Telefone (opcional)</Label>
              <Input
                value={formData.phone}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-white text-base font-semibold">Como você assistiu?</Label>
              <RadioGroup
                value={formData.participation_type || ""}
                onValueChange={(v) => update({ participation_type: v as "presencial" | "online" })}
                className="flex gap-4"
              >
                {[
                  { value: "presencial", label: "Presencial" },
                  { value: "online", label: "Online" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={opt.value}
                      id={`part-${opt.value}`}
                      className="border-white/30 text-secondary"
                    />
                    <Label htmlFor={`part-${opt.value}`} className="text-white/80 cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      );
    }

    if (step === "nps") {
      return (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <p className="text-secondary text-sm font-medium mb-2 uppercase tracking-wider">
              Indicação
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              De 0 a 10, o quanto você indicaria o Grifo Talks para alguém do seu nível?
            </h1>
          </div>

          <div className="grid grid-cols-11 gap-1.5 md:gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
              <ScoreButton
                key={v}
                value={v}
                selected={formData.nps_score === v}
                onClick={() => update({ nps_score: v })}
              />
            ))}
          </div>

          <div className="flex justify-between text-sm text-white/50 px-1">
            <span>Nada provável</span>
            <span>Muito provável</span>
          </div>
        </div>
      );
    }

    if (step === "aspects") {
      return (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <p className="text-secondary text-sm font-medium mb-2 uppercase tracking-wider">
              Avaliação
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Como você avalia os seguintes aspectos da experiência no Grifo Talks?
            </h1>
            <p className="text-white/50 mt-3 text-sm">
              Considere a relevância para o seu momento, a profundidade das conversas e o quanto isso contribui para decisões reais dentro da sua empresa.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-1 items-center text-xs text-white/40 mb-2">
              <span className="mr-2">Escala:</span>
              {[1, 2, 3, 4, 5].map((v) => (
                <span key={v} className="w-10 text-center">{v}</span>
              ))}
            </div>
            {ASPECTS.map((aspect) => (
              <AspectRating
                key={aspect.key}
                label={aspect.label}
                value={formData[aspect.key] as number | null}
                onChange={(v) => update({ [aspect.key]: v } as Partial<FormData>)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (step === "feedback") {
      return (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <p className="text-secondary text-sm font-medium mb-2 uppercase tracking-wider">
              Feedback Final
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Qual o insight mais valioso que você teve durante o evento?
            </h1>
          </div>

          <Textarea
            value={formData.insight}
            onChange={(e) => update({ insight: e.target.value })}
            placeholder="Conte-nos..."
            className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary resize-none"
          />

          <div className="space-y-3 pt-4 border-t border-white/10">
            <Label className="text-white text-base font-semibold leading-relaxed">
              Você quer que nosso time avalie se você é perfil para o diagnóstico estratégico?
            </Label>
            <RadioGroup
              value={formData.next_step || ""}
              onValueChange={(v) => update({ next_step: v as "sim" | "talvez" | "nao" })}
              className="space-y-3"
            >
              {[
                { value: "sim", label: "Sim, faz sentido dar esse próximo passo" },
                { value: "talvez", label: "Talvez, ainda não decidi priorizar isso" },
                { value: "nao", label: "Não, ainda não vou ajustar isso agora" },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    "flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all",
                    formData.next_step === opt.value
                      ? "border-secondary bg-secondary/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  )}
                  onClick={() => update({ next_step: opt.value as "sim" | "talvez" | "nao" })}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`next-${opt.value}`}
                    className="border-white/30 text-secondary"
                  />
                  <Label htmlFor={`next-${opt.value}`} className="text-white/80 cursor-pointer text-sm leading-snug">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#0A1C2F] flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-center">
        <img src={grifoLogo} alt="Grifo" className="h-10" />
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10 w-full">
        <motion.div
          className="h-full bg-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            <span className="text-white/50 text-sm">
              {currentStep + 1} de {totalSteps}
            </span>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitMutation.isPending}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : currentStep === totalSteps - 1 ? (
                "Enviar"
              ) : (
                <>
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
