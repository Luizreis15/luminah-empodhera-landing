import { useSales, sourceLabels, platformLabels, TransactionSource, SalePlatform } from "@/hooks/useFinance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Loader2, TrendingUp, Users, ShoppingCart } from "lucide-react";

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8B5CF6',
];

export function SalesCharts() {
  const { data: sales, isLoading } = useSales();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calculate totals
  const totalSales = sales?.length || 0;
  const totalRevenue = sales?.reduce((sum, s) => sum + Number(s.amount), 0) || 0;
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Group by creator
  const salesByCreator = sales?.reduce((acc, sale) => {
    if (sale.creator) {
      const key = sale.creator;
      if (!acc[key]) {
        acc[key] = { name: sourceLabels[key as TransactionSource], value: 0, count: 0 };
      }
      acc[key].value += Number(sale.amount);
      acc[key].count += 1;
    }
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const creatorData = salesByCreator ? Object.values(salesByCreator) : [];

  // Group by platform
  const salesByPlatform = sales?.reduce((acc, sale) => {
    const key = sale.platform;
    if (!acc[key]) {
      acc[key] = { name: platformLabels[key as SalePlatform], value: 0, count: 0 };
    }
    acc[key].value += Number(sale.amount);
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const platformData = salesByPlatform ? Object.values(salesByPlatform) : [];

  // Group by source
  const salesBySource = sales?.reduce((acc, sale) => {
    const key = sale.source;
    if (!acc[key]) {
      acc[key] = { name: sourceLabels[key as TransactionSource], value: 0, count: 0 };
    }
    acc[key].value += Number(sale.amount);
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const sourceData = salesBySource ? Object.values(salesBySource) : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            Valor: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Vendas: {payload[0].payload.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="text-2xl font-display font-semibold">{totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-display font-semibold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-display font-semibold text-blue-600">{formatCurrency(averageTicket)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Creator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendas por Criadora</CardTitle>
          </CardHeader>
          <CardContent>
            {creatorData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Nenhuma venda com criadora associada
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creatorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creatorData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {/* Legend with values */}
            {creatorData.length > 0 && (
              <div className="mt-4 space-y-2">
                {creatorData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{item.count} vendas</span>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales by Platform */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendas por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            {platformData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Nenhuma venda registrada
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical">
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {/* Legend with values */}
            {platformData.length > 0 && (
              <div className="mt-4 space-y-2">
                {platformData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{item.count} vendas</span>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales by Source */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Vendas por Origem</CardTitle>
          </CardHeader>
          <CardContent>
            {sourceData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Nenhuma venda registrada
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name="Valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
