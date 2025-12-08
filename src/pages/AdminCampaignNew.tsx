import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, Loader2, Sparkles, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminCampaignNew() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('body');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateHtml = async () => {
    if (!bodyText.trim()) {
      toast({
        title: 'Corpo do email obrigatório',
        description: 'Escreva o conteúdo do email antes de gerar o HTML',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-email-html', {
        body: { bodyText, ctaText, ctaLink },
      });

      if (error) throw error;

      if (data?.html) {
        setHtmlContent(data.html);
        setActiveTab('html');
        toast({ title: 'HTML gerado com sucesso!' });
      } else {
        throw new Error('Resposta inválida da IA');
      }
    } catch (error: any) {
      console.error('Error generating HTML:', error);
      toast({
        title: 'Erro ao gerar HTML',
        description: error.message || 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !subject.trim() || !htmlContent.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha título, assunto e gere o HTML',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.from('campaigns').insert({
        title: title.trim(),
        subject: subject.trim(),
        html_content: htmlContent,
        status: 'draft',
      });

      if (error) throw error;

      toast({ title: 'Campanha salva!' });
      navigate('/admin/campaigns');
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: 'Erro ao salvar',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-foreground">Nova Campanha</h1>
          <p className="text-muted-foreground mt-1">Escreva o conteúdo e gere HTML premium automaticamente</p>
        </div>

        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Campanha</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Newsletter de Dezembro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto do Email</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: 🌟 Novidades exclusivas para você!"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="body">Corpo do Email</TabsTrigger>
              <TabsTrigger value="html" disabled={!htmlContent}>
                <Code className="h-4 w-4 mr-2" />
                HTML Gerado
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!htmlContent}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="body" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Conteúdo do Email</Label>
                <Textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="min-h-[300px]"
                  placeholder={`Escreva o conteúdo do seu email aqui...

Exemplo:
Temos uma novidade incrível para compartilhar com você!

No dia 15 de março, acontecerá o EMPODHERA - um evento exclusivo que vai transformar a forma como você faz networking e gera negócios.

Serão palestras inspiradoras, conexões valiosas e muitas oportunidades de crescimento profissional.

Não perca essa chance única de fazer parte dessa comunidade de mulheres empreendedoras!`}
                />
                <p className="text-sm text-muted-foreground">
                  A saudação com o nome do contato será adicionada automaticamente
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaText">Texto do Botão (opcional)</Label>
                  <Input
                    id="ctaText"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Ex: Garantir Minha Vaga"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaLink">Link do Botão (opcional)</Label>
                  <Input
                    id="ctaLink"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="Ex: https://seusite.com/inscricao"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateHtml}
                disabled={isGenerating || !bodyText.trim()}
                className="w-full md:w-auto"
                size="lg"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2" />
                )}
                {isGenerating ? 'Gerando HTML Premium...' : 'Gerar HTML Premium'}
              </Button>
            </TabsContent>

            <TabsContent value="html" className="mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>HTML Gerado</Label>
                  <span className="text-sm text-muted-foreground">Editável se necessário</span>
                </div>
                <Textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="font-mono text-sm min-h-[500px]"
                />
                <p className="text-sm text-muted-foreground">
                  Use <code className="bg-muted px-1 rounded">{"{{nome}}"}</code> para incluir o nome do contato
                </p>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm text-muted-foreground border-b border-border">
                  Preview do Email (nome substituído por "Maria")
                </div>
                <div className="p-4 bg-background">
                  <iframe
                    srcDoc={htmlContent.replace(/\{\{nome\}\}/g, 'Maria')}
                    className="w-full h-[600px] border-0 rounded-lg"
                    title="Email Preview"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/campaigns')}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !htmlContent}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Rascunho
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
