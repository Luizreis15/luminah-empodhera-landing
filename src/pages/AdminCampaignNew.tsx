import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #F6EFE8;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #A67C52, #C89F7A);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 32px;
      margin: 0;
      font-family: Georgia, serif;
      letter-spacing: 2px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    .content h2 {
      color: #A67C52;
      font-family: Georgia, serif;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .content p {
      margin-bottom: 16px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #A67C52, #C89F7A);
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background-color: #2C2420;
      padding: 30px 20px;
      text-align: center;
      color: #C89F7A;
    }
    .footer p {
      margin: 5px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EMPODHERA</h1>
    </div>
    <div class="content">
      <h2>Olá, {{nome}}!</h2>
      <p>Escreva aqui o conteúdo do seu email...</p>
      <p>Você pode usar a variável <strong>{{nome}}</strong> para personalizar a saudação.</p>
      <p style="text-align: center;">
        <a href="https://seusite.com" class="button">Saiba Mais</a>
      </p>
    </div>
    <div class="footer">
      <p>EMPODHERA</p>
      <p>Conectando mulheres, gerando negócios</p>
    </div>
  </div>
</body>
</html>`;

export default function AdminCampaignNew() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState(defaultTemplate);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim() || !subject.trim() || !htmlContent.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha título, assunto e conteúdo',
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
          <p className="text-muted-foreground mt-1">Crie um email marketing com visual EMPODHERA</p>
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

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="editor">Editor HTML</TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-4">
              <div className="space-y-2">
                <Label>Conteúdo HTML</Label>
                <Textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="font-mono text-sm min-h-[500px]"
                  placeholder="Cole ou edite o HTML do email..."
                />
                <p className="text-sm text-muted-foreground">
                  Use <code className="bg-muted px-1 rounded">{"{{nome}}"}</code> para incluir o nome do contato
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm text-muted-foreground border-b border-border">
                  Preview do Email
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
            <Button onClick={handleSave} disabled={isSaving}>
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
