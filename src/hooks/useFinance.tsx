import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Types based on database schema
export type TransactionType = 'receita' | 'despesa';
export type PaymentMethod = 'pix' | 'credito' | 'debito' | 'transferencia' | 'boleto';
export type TransactionSource = 'organico' | 'indicacao' | 'criadora_samira' | 'criadora_simone' | 'criadora_sueli' | 'trafego_pago';
export type TransactionStatus = 'previsto' | 'recebido' | 'pago' | 'cancelado';
export type SalePlatform = 'site' | 'whatsapp' | 'instagram' | 'sympla' | 'indicacao';
export type SponsorPlan = 'bronze' | 'prata' | 'ouro' | 'diamante';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category_id: string | null;
  subcategory: string | null;
  description: string | null;
  amount: number;
  date: string;
  payment_method: PaymentMethod | null;
  source: TransactionSource | null;
  status: TransactionStatus;
  is_recurring: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Sale {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  amount: number;
  source: TransactionSource;
  creator: TransactionSource | null;
  platform: SalePlatform;
  date: string;
  notes: string | null;
  transaction_id: string | null;
  created_by: string;
  created_at: string;
}

export interface Sponsor {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  plan: SponsorPlan;
  contracted_value: number;
  payment_status: TransactionStatus;
  benefits_delivered: string[];
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceStats {
  totalReceita: number;
  totalDespesa: number;
  lucroLiquido: number;
  margem: number;
  receitaPrevista: number;
  despesaPrevista: number;
}

export interface TransactionFilters {
  type?: TransactionType;
  category_id?: string;
  status?: TransactionStatus;
  source?: TransactionSource;
  startDate?: string;
  endDate?: string;
}

// Categories Hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    }
  });
}

// Transactions Hook
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.source) {
        query = query.eq('source', filters.source);
      }
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    }
  });
}

// Create Transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'category'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] });
      toast.success('Transação criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar transação: ' + error.message);
    }
  });
}

// Update Transaction
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] });
      toast.success('Transação atualizada!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  });
}

// Delete Transaction
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] });
      toast.success('Transação excluída!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir: ' + error.message);
    }
  });
}

// Sales Hook
export function useSales(filters?: { startDate?: string; endDate?: string; source?: TransactionSource; creator?: TransactionSource }) {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: async () => {
      let query = supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }
      if (filters?.source) {
        query = query.eq('source', filters.source);
      }
      if (filters?.creator) {
        query = query.eq('creator', filters.creator);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Sale[];
    }
  });
}

// Create Sale
export function useCreateSale() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sale: Omit<Sale, 'id' | 'created_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          ...sale,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Venda registrada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar venda: ' + error.message);
    }
  });
}

// Sponsors Hook
export function useSponsors() {
  return useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Sponsor[];
    }
  });
}

// Create Sponsor
export function useCreateSponsor() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sponsor: Omit<Sponsor, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('sponsors')
        .insert({
          ...sponsor,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast.success('Patrocinador adicionado!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar patrocinador: ' + error.message);
    }
  });
}

// Update Sponsor
export function useUpdateSponsor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sponsor> & { id: string }) => {
      const { data, error } = await supabase
        .from('sponsors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast.success('Patrocinador atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  });
}

// Finance Stats Hook
export function useFinanceStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['finance-stats', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('type, amount, status');

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      const stats: FinanceStats = {
        totalReceita: 0,
        totalDespesa: 0,
        lucroLiquido: 0,
        margem: 0,
        receitaPrevista: 0,
        despesaPrevista: 0
      };

      data?.forEach((t) => {
        const amount = Number(t.amount);
        if (t.type === 'receita') {
          if (t.status === 'recebido') {
            stats.totalReceita += amount;
          } else if (t.status === 'previsto') {
            stats.receitaPrevista += amount;
          }
        } else {
          if (t.status === 'pago') {
            stats.totalDespesa += amount;
          } else if (t.status === 'previsto') {
            stats.despesaPrevista += amount;
          }
        }
      });

      stats.lucroLiquido = stats.totalReceita - stats.totalDespesa;
      stats.margem = stats.totalReceita > 0 
        ? (stats.lucroLiquido / stats.totalReceita) * 100 
        : 0;

      return stats;
    }
  });
}

// Chart Data Hook
export function useChartData(startDate?: string, endDate?: string) {
  const { data: transactions } = useTransactions({ startDate, endDate });
  const { data: categories } = useCategories();

  // Group by month for line chart
  const monthlyData = transactions?.reduce((acc, t) => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { month, receita: 0, despesa: 0 };
    }
    const amount = Number(t.amount);
    if (t.type === 'receita' && t.status === 'recebido') {
      acc[month].receita += amount;
    } else if (t.type === 'despesa' && t.status === 'pago') {
      acc[month].despesa += amount;
    }
    return acc;
  }, {} as Record<string, { month: string; receita: number; despesa: number }>);

  // Expenses by category for pie chart
  const expensesByCategory = transactions
    ?.filter(t => t.type === 'despesa' && t.status === 'pago')
    ?.reduce((acc, t) => {
      const categoryName = t.category?.name || 'Outros';
      const color = t.category?.color || '#78716C';
      if (!acc[categoryName]) {
        acc[categoryName] = { name: categoryName, value: 0, color };
      }
      acc[categoryName].value += Number(t.amount);
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

  // Revenue by source for bar chart
  const revenueBySource = transactions
    ?.filter(t => t.type === 'receita' && t.status === 'recebido')
    ?.reduce((acc, t) => {
      const source = t.source || 'organico';
      if (!acc[source]) {
        acc[source] = { source, value: 0 };
      }
      acc[source].value += Number(t.amount);
      return acc;
    }, {} as Record<string, { source: string; value: number }>);

  return {
    monthlyData: monthlyData ? Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)) : [],
    expensesByCategory: expensesByCategory ? Object.values(expensesByCategory) : [],
    revenueBySource: revenueBySource ? Object.values(revenueBySource) : []
  };
}

// Labels for display
export const sourceLabels: Record<TransactionSource, string> = {
  organico: 'Orgânico',
  indicacao: 'Indicação',
  criadora_samira: 'Samira',
  criadora_simone: 'Simone',
  criadora_sueli: 'Sueli',
  trafego_pago: 'Tráfego Pago'
};

export const statusLabels: Record<TransactionStatus, string> = {
  previsto: 'Previsto',
  recebido: 'Recebido',
  pago: 'Pago',
  cancelado: 'Cancelado'
};

export const platformLabels: Record<SalePlatform, string> = {
  site: 'Site',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  sympla: 'Sympla',
  indicacao: 'Indicação'
};

export const planLabels: Record<SponsorPlan, string> = {
  bronze: 'Bronze',
  prata: 'Prata',
  ouro: 'Ouro',
  diamante: 'Diamante'
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: 'PIX',
  credito: 'Cartão de Crédito',
  debito: 'Cartão de Débito',
  transferencia: 'Transferência',
  boleto: 'Boleto'
};
