import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Users, Mail, Send, TrendingUp } from 'lucide-react';

interface Stats {
  totalContacts: number;
  totalCampaigns: number;
  sentEmails: number;
  draftCampaigns: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    totalCampaigns: 0,
    sentEmails: 0,
    draftCampaigns: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [contactsRes, campaignsRes, logsRes, draftsRes] = await Promise.all([
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('campaigns').select('id', { count: 'exact', head: true }),
        supabase.from('email_logs').select('id', { count: 'exact', head: true }).eq('status', 'sent'),
        supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      ]);

      setStats({
        totalContacts: contactsRes.count || 0,
        totalCampaigns: campaignsRes.count || 0,
        sentEmails: logsRes.count || 0,
        draftCampaigns: draftsRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { 
      icon: Users, 
      label: 'Total de Contatos', 
      value: stats.totalContacts,
      color: 'bg-blue-500/10 text-blue-600' 
    },
    { 
      icon: Mail, 
      label: 'Campanhas Criadas', 
      value: stats.totalCampaigns,
      color: 'bg-purple-500/10 text-purple-600' 
    },
    { 
      icon: Send, 
      label: 'Emails Enviados', 
      value: stats.sentEmails,
      color: 'bg-green-500/10 text-green-600' 
    },
    { 
      icon: TrendingUp, 
      label: 'Rascunhos', 
      value: stats.draftCampaigns,
      color: 'bg-amber-500/10 text-amber-600' 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu email marketing</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 border border-border shadow-soft"
            >
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-display text-foreground mb-1">
                {isLoading ? '...' : stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
          <h2 className="font-display text-xl text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/contacts"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all group"
            >
              <Users className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-foreground">Gerenciar Contatos</div>
              <div className="text-sm text-muted-foreground">Upload e gestão da lista</div>
            </a>
            <a
              href="/admin/campaigns/new"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all group"
            >
              <Mail className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-foreground">Criar Campanha</div>
              <div className="text-sm text-muted-foreground">Novo email marketing</div>
            </a>
            <a
              href="/admin/campaigns"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all group"
            >
              <Send className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-foreground">Ver Campanhas</div>
              <div className="text-sm text-muted-foreground">Histórico e status</div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
