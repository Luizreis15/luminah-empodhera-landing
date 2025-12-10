import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Trash2, Loader2, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WaitingListEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export default function AdminWaitingList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["waiting-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waiting_list")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WaitingListEntry[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("waiting_list").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiting-list"] });
      toast({ title: "Entrada removida com sucesso" });
    },
    onError: () => {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a entrada.",
        variant: "destructive",
      });
    },
  });

  const exportToCSV = () => {
    if (!entries || entries.length === 0) return;

    const headers = ["Nome", "Email", "Telefone", "Data de Cadastro"];
    const csvContent = [
      headers.join(","),
      ...entries.map((entry) =>
        [
          `"${entry.name}"`,
          `"${entry.email}"`,
          `"${entry.phone || ""}"`,
          `"${format(new Date(entry.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `lista-espera-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Clock className="h-6 w-6 text-gold" />
              Lista de Espera
            </h1>
            <p className="text-muted-foreground">
              Gerencie as pessoas que aguardam novas vagas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-lg">
              <Users className="h-4 w-4 text-gold" />
              <span className="font-semibold text-gold">
                {entries?.length || 0} inscritos
              </span>
            </div>
            <Button
              onClick={exportToCSV}
              disabled={!entries || entries.length === 0}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{entry.phone || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(entry.id)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma inscrição ainda
            </h3>
            <p className="text-muted-foreground">
              As inscrições na lista de espera aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
