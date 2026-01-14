import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { SalesTable } from "@/components/finance/SalesTable";
import { SaleForm } from "@/components/finance/SaleForm";

export default function FinanceSales() {
  return (
    <FinanceLayout title="Vendas">
      <div className="space-y-6">
        <div className="flex justify-end">
          <SaleForm />
        </div>
        <SalesTable />
      </div>
    </FinanceLayout>
  );
}
