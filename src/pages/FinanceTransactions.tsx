import { useState } from "react";
import { Plus } from "lucide-react";
import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { TransactionTable } from "@/components/finance/TransactionTable";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { Button } from "@/components/ui/button";
import { useTransactions, TransactionType } from "@/hooks/useFinance";

interface FinanceTransactionsProps {
  type: TransactionType;
}

export default function FinanceTransactions({ type }: FinanceTransactionsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: transactions, isLoading } = useTransactions({ type });

  const title = type === 'receita' ? 'Receitas' : 'Despesas';

  return (
    <FinanceLayout title={title}>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova {type === 'receita' ? 'Receita' : 'Despesa'}
          </Button>
        </div>

        <TransactionTable 
          transactions={transactions} 
          isLoading={isLoading}
          type={type}
        />
      </div>

      <TransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        defaultType={type}
      />
    </FinanceLayout>
  );
}
