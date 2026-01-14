import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { sourceLabels } from "@/hooks/useFinance";

interface ChartData {
  monthlyData: Array<{ month: string; receita: number; despesa: number }>;
  expensesByCategory: Array<{ name: string; value: number; color: string }>;
  revenueBySource: Array<{ source: string; value: number }>;
}

interface FinanceChartsProps {
  data: ChartData;
  isLoading: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[parseInt(m) - 1]}/${year.slice(2)}`;
}

export function FinanceCharts({ data, isLoading }: FinanceChartsProps) {
  const sourceColors: Record<string, string> = {
    organico: '#22C55E',
    indicacao: '#3B82F6',
    criadora_samira: '#EC4899',
    criadora_simone: '#8B5CF6',
    criadora_sueli: '#F97316',
    trafego_pago: '#14B8A6'
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Receita vs Despesa */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Receita vs Despesa Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          {data.monthlyData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DED4" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={formatMonth}
                  stroke="#8B7B6B"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="#8B7B6B"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={formatMonth}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E8DED4',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  name="Receita"
                  stroke="#22C55E" 
                  strokeWidth={3}
                  dot={{ fill: '#22C55E', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="despesa" 
                  name="Despesa"
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart - Despesas por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {data.expensesByCategory.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Receita por Origem */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Receita por Origem</CardTitle>
        </CardHeader>
        <CardContent>
          {data.revenueBySource.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.revenueBySource}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DED4" />
                <XAxis 
                  dataKey="source" 
                  tickFormatter={(s) => sourceLabels[s as keyof typeof sourceLabels] || s}
                  stroke="#8B7B6B"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="#8B7B6B"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(s) => sourceLabels[s as keyof typeof sourceLabels] || s}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E8DED4',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" name="Receita" radius={[4, 4, 0, 0]}>
                  {data.revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sourceColors[entry.source] || '#A67C52'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
