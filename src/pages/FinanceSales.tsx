import { useState } from "react";
import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { SalesTable } from "@/components/finance/SalesTable";
import { SaleForm } from "@/components/finance/SaleForm";
import { SalesCharts } from "@/components/finance/SalesCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Table } from "lucide-react";

export default function FinanceSales() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <FinanceLayout title="Vendas">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="lista" className="gap-2">
                <Table className="h-4 w-4" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <SaleForm />
        </div>

        {activeTab === "dashboard" ? (
          <SalesCharts />
        ) : (
          <SalesTable />
        )}
      </div>
    </FinanceLayout>
  );
}
