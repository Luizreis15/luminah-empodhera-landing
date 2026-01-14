import { useState } from "react";
import { Sponsor, useSponsors, useUpdateSponsor, planLabels, statusLabels, TransactionStatus } from "@/hooks/useFinance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const planColors: Record<string, string> = {
  bronze: "bg-amber-600/10 text-amber-700 border-amber-600/20",
  prata: "bg-slate-400/10 text-slate-600 border-slate-400/20",
  ouro: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  diamante: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
};

const statusColors: Record<TransactionStatus, string> = {
  previsto: "bg-blue-500/10 text-blue-700",
  recebido: "bg-green-500/10 text-green-700",
  pago: "bg-green-500/10 text-green-700",
  cancelado: "bg-red-500/10 text-red-700",
};

export function SponsorsTable() {
  const { data: sponsors, isLoading } = useSponsors();
  const updateSponsor = useUpdateSponsor();
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleStatusChange = async (sponsorId: string, newStatus: TransactionStatus) => {
    await updateSponsor.mutateAsync({
      id: sponsorId,
      payment_status: newStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalContracted = sponsors?.reduce((sum, s) => sum + Number(s.contracted_value), 0) || 0;
  const totalReceived = sponsors?.filter(s => s.payment_status === 'recebido').reduce((sum, s) => sum + Number(s.contracted_value), 0) || 0;

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Contratado</p>
          <p className="text-2xl font-display font-semibold">{formatCurrency(totalContracted)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Recebido</p>
          <p className="text-2xl font-display font-semibold text-green-600">{formatCurrency(totalReceived)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">A Receber</p>
          <p className="text-2xl font-display font-semibold text-blue-600">{formatCurrency(totalContracted - totalReceived)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum patrocinador cadastrado
                </TableCell>
              </TableRow>
            ) : (
              sponsors?.map((sponsor) => (
                <TableRow key={sponsor.id}>
                  <TableCell className="font-medium">{sponsor.company_name}</TableCell>
                  <TableCell>
                    <Badge className={planColors[sponsor.plan]}>
                      {planLabels[sponsor.plan]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(sponsor.contracted_value)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={sponsor.payment_status}
                      onValueChange={(value) => handleStatusChange(sponsor.id, value as TransactionStatus)}
                    >
                      <SelectTrigger className={`w-32 ${statusColors[sponsor.payment_status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="previsto">Previsto</SelectItem>
                        <SelectItem value="recebido">Recebido</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{sponsor.contact_name || '-'}</div>
                      <div className="text-xs text-muted-foreground">{sponsor.contact_email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedSponsor(sponsor)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedSponsor} onOpenChange={() => setSelectedSponsor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Patrocinador</DialogTitle>
          </DialogHeader>
          {selectedSponsor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Empresa</label>
                  <p className="font-medium">{selectedSponsor.company_name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Plano</label>
                  <p className="font-medium">{planLabels[selectedSponsor.plan]}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Valor Contratado</label>
                  <p className="font-medium">{formatCurrency(selectedSponsor.contracted_value)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <p className="font-medium">{statusLabels[selectedSponsor.payment_status]}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Contato</label>
                  <p className="font-medium">{selectedSponsor.contact_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedSponsor.contact_email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Telefone</label>
                  <p className="font-medium">{selectedSponsor.contact_phone || '-'}</p>
                </div>
              </div>
              {selectedSponsor.notes && (
                <div>
                  <label className="text-sm text-muted-foreground">Observações</label>
                  <p className="font-medium">{selectedSponsor.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
