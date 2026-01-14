import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Transaction, 
  useDeleteTransaction,
  sourceLabels,
  statusLabels
} from "@/hooks/useFinance";
import { TransactionForm } from "./TransactionForm";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  type?: 'receita' | 'despesa';
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

const statusColors: Record<string, string> = {
  previsto: 'bg-amber-100 text-amber-700 border-amber-200',
  recebido: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pago: 'bg-rose-100 text-rose-700 border-rose-200',
  cancelado: 'bg-gray-100 text-gray-700 border-gray-200'
};

export function TransactionTable({ transactions, isLoading, type }: TransactionTableProps) {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteTransaction = useDeleteTransaction();

  const filteredTransactions = type 
    ? transactions?.filter(t => t.type === type)
    : transactions;

  const handleDelete = async () => {
    if (deleteId) {
      await deleteTransaction.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!filteredTransactions || filteredTransactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Data</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.category && (
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: transaction.category.color }}
                      />
                    )}
                    <span>{transaction.category?.name || '-'}</span>
                    {transaction.subcategory && (
                      <span className="text-muted-foreground text-sm">
                        / {transaction.subcategory}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.description || '-'}
                </TableCell>
                <TableCell>
                  {transaction.source ? sourceLabels[transaction.source] : '-'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-normal", statusColors[transaction.status])}
                  >
                    {statusLabels[transaction.status]}
                  </Badge>
                </TableCell>
                <TableCell className={cn(
                  "text-right font-semibold",
                  transaction.type === 'receita' ? 'text-emerald-600' : 'text-rose-600'
                )}>
                  {transaction.type === 'receita' ? '+' : '-'} 
                  {formatCurrency(Number(transaction.amount))}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditTransaction(transaction)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteId(transaction.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TransactionForm
        open={!!editTransaction}
        onOpenChange={(open) => !open && setEditTransaction(null)}
        transaction={editTransaction}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será permanentemente removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
