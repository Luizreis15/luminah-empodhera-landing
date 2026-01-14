import { useState } from "react";
import { Sale, useSales, sourceLabels, platformLabels } from "@/hooks/useFinance";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SalesTable() {
  const { data: sales, isLoading } = useSales();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Comprador</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Criadora</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhuma venda registrada
                </TableCell>
              </TableRow>
            ) : (
              sales?.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.buyer_name}</div>
                      <div className="text-sm text-muted-foreground">{sale.buyer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(sale.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {sourceLabels[sale.source]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {platformLabels[sale.platform]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sale.creator ? sourceLabels[sale.creator] : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedSale(sale)}
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

      <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Venda</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Comprador</label>
                  <p className="font-medium">{selectedSale.buyer_name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedSale.buyer_email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Telefone</label>
                  <p className="font-medium">{selectedSale.buyer_phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Valor</label>
                  <p className="font-medium text-green-600">{formatCurrency(selectedSale.amount)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Data</label>
                  <p className="font-medium">
                    {format(new Date(selectedSale.date), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Origem</label>
                  <p className="font-medium">{sourceLabels[selectedSale.source]}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Plataforma</label>
                  <p className="font-medium">{platformLabels[selectedSale.platform]}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Criadora</label>
                  <p className="font-medium">
                    {selectedSale.creator ? sourceLabels[selectedSale.creator] : '-'}
                  </p>
                </div>
              </div>
              {selectedSale.notes && (
                <div>
                  <label className="text-sm text-muted-foreground">Observações</label>
                  <p className="font-medium">{selectedSale.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
