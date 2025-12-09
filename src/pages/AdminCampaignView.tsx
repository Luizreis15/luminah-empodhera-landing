import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Loader2, CheckCircle, XCircle, Clock, TestTube, CalendarClock, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  html_content: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  scheduled_at: string | null;
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
  const [isScheduling, setIsScheduling] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleHour, setScheduleHour] = useState('09');
  const [scheduleMinute, setScheduleMinute] = useState('00');
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

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast({
        title: 'Data obrigatória',
        description: 'Selecione uma data para o agendamento',
        variant: 'destructive',
      });
      return;
    }

    // Build scheduled datetime
    const scheduledDateTime = new Date(scheduleDate);
    scheduledDateTime.setHours(parseInt(scheduleHour), parseInt(scheduleMinute), 0, 0);

    // Validate not in the past
    if (scheduledDateTime <= new Date()) {
      toast({
        title: 'Data inválida',
        description: 'A data e hora devem ser no futuro',
        variant: 'destructive',
      });
      return;
    }

    setIsScheduling(true);

    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ 
          status: 'scheduled',
          scheduled_at: scheduledDateTime.toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Campanha agendada!',
        description: `Será enviada em ${format(scheduledDateTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      });

      setScheduleDialogOpen(false);
      fetchCampaign();
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      toast({
        title: 'Erro ao agendar',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleCancelSchedule = async () => {
    if (!confirm('Cancelar o agendamento desta campanha?')) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ 
          status: 'draft',
          scheduled_at: null
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Agendamento cancelado' });
      fetchCampaign();
    } catch (error) {
      console.error('Error canceling schedule:', error);
      toast({
        title: 'Erro ao cancelar',
        variant: 'destructive',
      });
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

  const getStatusBadge = () => {
    if (!campaign) return null;
    
    switch (campaign.status) {
      case 'sent':
        return (
          <Badge className="bg-green-500/10 text-green-600">
            Enviada
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-500/10 text-blue-600">
            <CalendarClock className="h-3 w-3 mr-1" />
            Agendada para {campaign.scheduled_at && format(new Date(campaign.scheduled_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
          </Badge>
        );
      case 'sending':
        return (
          <Badge className="bg-blue-500/10 text-blue-600">
            Enviando...
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600">
            Rascunho
          </Badge>
        );
    }
  };

  // Generate hour options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

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

            {campaign.status === 'scheduled' && (
              <Button variant="outline" onClick={handleCancelSchedule}>
                <X className="h-4 w-4 mr-2" />
                Cancelar Agendamento
              </Button>
            )}

            {campaign.status === 'draft' && (
              <>
                <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Agendar Disparo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agendar Disparo</DialogTitle>
                      <DialogDescription>
                        Escolha a data e horário para enviar a campanha automaticamente.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !scheduleDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarClock className="mr-2 h-4 w-4" />
                              {scheduleDate ? format(scheduleDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={scheduleDate}
                              onSelect={setScheduleDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hora</Label>
                          <Select value={scheduleHour} onValueChange={setScheduleHour}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((h) => (
                                <SelectItem key={h} value={h}>{h}h</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Minuto</Label>
                          <Select value={scheduleMinute} onValueChange={setScheduleMinute}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSchedule} disabled={isScheduling || !scheduleDate}>
                        {isScheduling ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CalendarClock className="h-4 w-4 mr-2" />
                        )}
                        Agendar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button onClick={handleSend} disabled={isSending}>
                  {isSending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Enviar Agora
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              {getStatusBadge()}
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
