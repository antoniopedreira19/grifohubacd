import { Construction, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Automacoes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Zap className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold text-primary">Automações</h1>
      </div>

      {/* Under Construction */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Em Construção</h2>
          <p className="text-muted-foreground max-w-md">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
