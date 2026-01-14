import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FinanceStats as FinanceStatsType } from "@/hooks/useFinance";
import { cn } from "@/lib/utils";

interface FinanceStatsProps {
  stats: FinanceStatsType | undefined;
  isLoading: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function FinanceStats({ stats, isLoading }: FinanceStatsProps) {
  const cards = [
    {
      title: "Receita Total",
      value: stats?.totalReceita || 0,
      previsto: stats?.receitaPrevista || 0,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Despesa Total",
      value: stats?.totalDespesa || 0,
      previsto: stats?.despesaPrevista || 0,
      icon: TrendingDown,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    },
    {
      title: "Lucro Líquido",
      value: stats?.lucroLiquido || 0,
      icon: DollarSign,
      color: stats?.lucroLiquido && stats.lucroLiquido >= 0 ? "text-primary" : "text-rose-600",
      bgColor: stats?.lucroLiquido && stats.lucroLiquido >= 0 ? "bg-amber-50" : "bg-rose-50",
      borderColor: stats?.lucroLiquido && stats.lucroLiquido >= 0 ? "border-amber-200" : "border-rose-200"
    },
    {
      title: "Margem",
      value: stats?.margem || 0,
      isPercentage: true,
      icon: Percent,
      color: stats?.margem && stats.margem >= 0 ? "text-blue-600" : "text-rose-600",
      bgColor: stats?.margem && stats.margem >= 0 ? "bg-blue-50" : "bg-rose-50",
      borderColor: stats?.margem && stats.margem >= 0 ? "border-blue-200" : "border-rose-200"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card 
          key={card.title} 
          className={cn(
            "border-2 transition-all hover:shadow-md",
            card.borderColor
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {card.title}
              </span>
              <div className={cn("p-2 rounded-lg", card.bgColor)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
            </div>
            <div className={cn("text-2xl font-bold", card.color)}>
              {card.isPercentage 
                ? `${card.value.toFixed(1)}%`
                : formatCurrency(card.value)
              }
            </div>
            {card.previsto !== undefined && card.previsto > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                + {formatCurrency(card.previsto)} previsto
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
