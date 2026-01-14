import { useState } from "react";
import { Plus } from "lucide-react";
import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { FinanceStats } from "@/components/finance/FinanceStats";
import { FinanceCharts } from "@/components/finance/FinanceCharts";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { Button } from "@/components/ui/button";
import { useFinanceStats, useChartData } from "@/hooks/useFinance";

export default function FinanceDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: stats, isLoading: statsLoading } = useFinanceStats();
  const chartData = useChartData();

  return (
    <FinanceLayout title="Dashboard Financeiro">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <FinanceStats stats={stats} isLoading={statsLoading} />
        
        <FinanceCharts 
          data={chartData} 
          isLoading={statsLoading} 
        />
      </div>

      <TransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </FinanceLayout>
  );
}
