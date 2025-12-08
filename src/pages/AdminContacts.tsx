import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Search, Loader2, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Contact {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchContacts = useCallback(async () => {
    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Erro ao carregar contatos',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, envie um arquivo CSV',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header if present
      const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;
      
      // Detect delimiter: semicolon or comma
      const firstDataLine = lines[startIndex] || lines[0];
      const delimiter = firstDataLine.includes(';') ? ';' : ',';
      
      const newContacts: { email: string; name: string | null }[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(delimiter).map(p => p.trim().replace(/"/g, ''));
        
        // Find the email in the parts (could be in any column)
        let email = '';
        let name: string | null = null;
        
        for (const part of parts) {
          if (emailRegex.test(part)) {
            email = part;
          } else if (part && !part.match(/^[\d,\.E\+]+$/) && part.length > 1) {
            // It's likely a name (not a number/phone)
            name = part;
          }
        }
        
        if (email) {
          newContacts.push({ email: email.toLowerCase(), name });
        }
      }

      if (newContacts.length === 0) {
        toast({
          title: 'Nenhum email válido',
          description: 'O arquivo não contém emails válidos',
          variant: 'destructive',
        });
        return;
      }

      // Batch insert with upsert to handle duplicates
      const { error } = await supabase
        .from('contacts')
        .upsert(newContacts, { onConflict: 'email', ignoreDuplicates: true });

      if (error) throw error;

      toast({
        title: 'Upload concluído!',
        description: `${newContacts.length} contatos processados`,
      });

      fetchContacts();
    } catch (error) {
      console.error('Error uploading contacts:', error);
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível processar o arquivo',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return;

    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      
      setContacts(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Contato excluído' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Erro ao excluir',
        variant: 'destructive',
      });
    }
  };

  const exportCSV = () => {
    const csv = ['Email,Nome,Data de Cadastro'];
    contacts.forEach(c => {
      csv.push(`${c.email},${c.name || ''},${new Date(c.created_at).toLocaleDateString('pt-BR')}`);
    });
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contatos-empodhera-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-foreground">Contatos</h1>
            <p className="text-muted-foreground mt-1">{contacts.length} contatos cadastrados</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV} disabled={contacts.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <label>
              <Button asChild disabled={isUploading}>
                <span className="cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload CSV
                </span>
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Formato do CSV:</strong> O arquivo deve conter emails na primeira coluna. 
            Opcionalmente, adicione nomes na segunda coluna separados por vírgula.
            <br />
            <strong>Exemplo:</strong> email@exemplo.com,Nome da Pessoa
          </p>
        </div>

        {/* Contacts Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum contato cadastrado ainda. Faça upload de um arquivo CSV para começar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.email}</TableCell>
                    <TableCell>{contact.name || '-'}</TableCell>
                    <TableCell>
                      {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
