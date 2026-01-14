import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions, useCategories } from "@/hooks/useFinance";
import { cn } from "@/lib/utils";

interface DREViewProps {
  startDate?: string;
  endDate?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function DREView({ startDate, endDate }: DREViewProps) {
  const { data: transactions, isLoading } = useTransactions({ startDate, endDate });
  const { data: categories } = useCategories();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display">DRE do Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate DRE values
  const receitaCategories = categories?.filter(c => c.type === 'receita') || [];
  const despesaCategories = categories?.filter(c => c.type === 'despesa') || [];

  const receitaByCategory: Record<string, number> = {};
  const despesaByCategory: Record<string, number> = {};

  transactions?.forEach((t) => {
    const amount = Number(t.amount);
    const categoryId = t.category_id || 'outros';
    const categoryName = t.category?.name || 'Outros';
    
    if (t.type === 'receita' && (t.status === 'recebido' || t.status === 'previsto')) {
      receitaByCategory[categoryName] = (receitaByCategory[categoryName] || 0) + amount;
    } else if (t.type === 'despesa' && (t.status === 'pago' || t.status === 'previsto')) {
      despesaByCategory[categoryName] = (despesaByCategory[categoryName] || 0) + amount;
    }
  });

  const totalReceita = Object.values(receitaByCategory).reduce((a, b) => a + b, 0);
  const totalDespesa = Object.values(despesaByCategory).reduce((a, b) => a + b, 0);
  
  // Separate platform fees
  const taxasPlataforma = despesaByCategory['Plataforma'] || 0;
  const outrasDepesas = totalDespesa - taxasPlataforma;
  
  const lucroOperacional = totalReceita - totalDespesa;
  const margem = totalReceita > 0 ? (lucroOperacional / totalReceita) * 100 : 0;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="font-display text-2xl">DRE do Evento</CardTitle>
        <p className="text-sm text-muted-foreground">
          Demonstrativo de Resultado do Evento EMPODHERA
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Receitas */}
        <div className="space-y-3">
          <h3 className="font-semibold text-emerald-700 uppercase text-sm tracking-wide">
            Receita Bruta
          </h3>
          <div className="space-y-2 pl-4 border-l-2 border-emerald-200">
            {Object.entries(receitaByCategory).map(([name, value]) => (
              <div key={name} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-medium text-emerald-600">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>= Total Receita</span>
            <span className="text-emerald-600">{formatCurrency(totalReceita)}</span>
          </div>
        </div>

        {/* Deduções */}
        <div className="space-y-3">
          <h3 className="font-semibold text-rose-700 uppercase text-sm tracking-wide">
            Deduções
          </h3>
          
          {taxasPlataforma > 0 && (
            <div className="flex justify-between text-sm pl-4 border-l-2 border-rose-200">
              <span className="text-muted-foreground">(-) Taxas de Plataforma</span>
              <span className="text-rose-600">- {formatCurrency(taxasPlataforma)}</span>
            </div>
          )}
          
          <div className="space-y-2 pl-4 border-l-2 border-rose-200">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              (-) Custos Operacionais
            </div>
            {Object.entries(despesaByCategory)
              .filter(([name]) => name !== 'Plataforma')
              .map(([name, value]) => (
                <div key={name} className="flex justify-between text-sm">
                  <span className="text-muted-foreground pl-2">{name}</span>
                  <span className="text-rose-600">- {formatCurrency(value)}</span>
                </div>
              ))}
          </div>
          
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>= Total Despesas</span>
            <span className="text-rose-600">- {formatCurrency(totalDespesa)}</span>
          </div>
        </div>

        {/* Resultado */}
        <div className={cn(
          "p-6 rounded-lg border-2",
          lucroOperacional >= 0 
            ? "bg-emerald-50 border-emerald-200" 
            : "bg-rose-50 border-rose-200"
        )}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Lucro Operacional</span>
            <span className={cn(
              "text-3xl font-bold",
              lucroOperacional >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {formatCurrency(lucroOperacional)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Margem</span>
            <span className={cn(
              "text-xl font-semibold",
              margem >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {margem.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p>* Valores incluem transações com status "Recebido/Pago" e "Previsto"</p>
          <p>* DRE = Demonstrativo do Resultado do Exercício</p>
        </div>
      </CardContent>
    </Card>
  );
}
