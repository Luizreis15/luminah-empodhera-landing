import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Loader2, CheckCircle, XCircle, Clock, TestTube } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  html_content: string;
  status: string;
  created_at: string;
  sent_at: string | null;
}

interface EmailLog {
  id: string;
  status: string;
  sent_at: string | null;
  error_message: string | null;
  contacts: {
    email: string;
    name: string | null;
  };
}

export default function AdminCampaignView() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchCampaign();
      fetchLogs();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast({
        title: 'Campanha não encontrada',
        variant: 'destructive',
      });
      navigate('/admin/campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select(`
          id,
          status,
          sent_at,
          error_message,
          contacts (email, name)
        `)
        .eq('campaign_id', id)
        .order('sent_at', { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleSend = async () => {
    if (!confirm('Enviar esta campanha para todos os contatos?')) return;
    
    setIsSending(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-campaign', {
        body: { campaignId: id }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Campanha enviada!',
        description: 'Os emails estão sendo processados',
      });
      
      fetchCampaign();
      fetchLogs();
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      toast({
        title: 'Email obrigatório',
        description: 'Informe um email para o teste',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingTest(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-test-email', {
        body: { campaignId: id, testEmail }
      });

      if (error) throw error;

      toast({
        title: 'Email de teste enviado!',
        description: `Verifique a caixa de entrada de ${testEmail}`,
      });

      setTestDialogOpen(false);
      setTestEmail('');
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Erro ao enviar teste',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!campaign) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/campaigns')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-3xl text-foreground">{campaign.title}</h1>
            <p className="text-muted-foreground mt-1">Assunto: {campaign.subject}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Enviar Teste
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Email de Teste</DialogTitle>
                  <DialogDescription>
                    Envie um email de teste para verificar como a campanha será exibida.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSendTest} disabled={isSendingTest}>
                    {isSendingTest ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Enviar Teste
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {campaign.status === 'draft' && (
              <Button onClick={handleSend} disabled={isSending}>
                {isSending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Enviar Campanha
              </Button>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <Badge className={
                campaign.status === 'sent' 
                  ? 'bg-green-500/10 text-green-600' 
                  : 'bg-amber-500/10 text-amber-600'
              }>
                {campaign.status === 'sent' ? 'Enviada' : 'Rascunho'}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Criada em</div>
              <div>{new Date(campaign.created_at).toLocaleDateString('pt-BR')}</div>
            </div>
            {campaign.sent_at && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Enviada em</div>
                <div>{new Date(campaign.sent_at).toLocaleDateString('pt-BR')}</div>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm text-muted-foreground border-b border-border">
            Preview do Email
          </div>
          <div className="p-4">
            <iframe
              srcDoc={campaign.html_content.replace(/\{\{nome\}\}/g, 'Maria')}
              className="w-full h-[400px] border-0 rounded-lg"
              title="Email Preview"
            />
          </div>
        </div>

        {/* Email Logs */}
        {logs.length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-4 py-2 text-sm font-medium border-b border-border">
              Histórico de Envios ({logs.length})
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.contacts?.email}</TableCell>
                    <TableCell>{log.contacts?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className="capitalize">{log.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.sent_at 
                        ? new Date(log.sent_at).toLocaleString('pt-BR') 
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
