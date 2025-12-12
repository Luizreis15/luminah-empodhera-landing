import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Check, Loader2 } from 'lucide-react';

interface ActivityTableProps {
  id: string;
  columns: string[];
  value?: Record<string, string>[];
  onSave: (value: Record<string, string>[]) => void;
  isSaving?: boolean;
}

export function ActivityTable({
  id,
  columns,
  value: initialValue = [],
  onSave,
  isSaving = false
}: ActivityTableProps) {
  const [rows, setRows] = useState<Record<string, string>[]>(
    initialValue.length > 0 ? initialValue : [createEmptyRow()]
  );
  const [showSaved, setShowSaved] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  function createEmptyRow() {
    const row: Record<string, string> = {};
    columns.forEach((col) => {
      row[col] = '';
    });
    return row;
  }

  useEffect(() => {
    if (initialValue.length > 0) {
      setRows(initialValue);
    }
  }, [initialValue]);

  // Debounced save
  useEffect(() => {
    if (!hasChanged) return;

    const timer = setTimeout(() => {
      // Only save non-empty rows
      const nonEmptyRows = rows.filter(row => 
        Object.values(row).some(v => v.trim() !== '')
      );
      if (nonEmptyRows.length > 0) {
        onSave(rows);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [rows, hasChanged, onSave]);

  const handleChange = (rowIndex: number, column: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };
    setRows(newRows);
    setHasChanged(true);
  };

  const addRow = () => {
    setRows([...rows, createEmptyRow()]);
    setHasChanged(true);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
      setHasChanged(true);
    }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className="text-left text-sm font-medium text-gold px-3 py-2 bg-gold/5 border border-gold/10 first:rounded-tl-lg last:rounded-tr-lg"
                >
                  {col}
                </th>
              ))}
              <th className="w-10 bg-gold/5 border border-gold/10 rounded-tr-lg"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border border-gold/10 p-1">
                    <Input
                      value={row[col] || ''}
                      onChange={(e) => handleChange(rowIndex, col, e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                      placeholder={`Digite ${col.toLowerCase()}...`}
                    />
                  </td>
                ))}
                <td className="border border-gold/10 p-1 text-center">
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={rows.length === 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="text-gold border-gold/20 hover:bg-gold/5"
        >
          <Plus size={14} className="mr-1" />
          Adicionar linha
        </Button>

        <div className="flex items-center gap-1 text-xs">
          {isSaving ? (
            <>
              <Loader2 size={12} className="animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Salvando...</span>
            </>
          ) : showSaved ? (
            <>
              <Check size={12} className="text-green-600" />
              <span className="text-green-600">Salvo</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
