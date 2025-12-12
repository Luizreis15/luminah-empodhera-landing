import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Check, Loader2 } from 'lucide-react';

interface ActivityTableProps {
  id: string;
  columns: string[];
  value: string[][];
  onSave: (value: string[][]) => void;
  isSaving: boolean;
}

export function ActivityTable({ 
  id, 
  columns, 
  value, 
  onSave, 
  isSaving 
}: ActivityTableProps) {
  const [rows, setRows] = useState<string[][]>(
    value.length > 0 ? value : [columns.map(() => '')]
  );
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (value.length > 0) {
      setRows(value);
    }
  }, [value]);

  // Debounced save
  const debouncedSave = useCallback(() => {
    const timeoutId = setTimeout(() => {
      const hasContent = rows.some(row => row.some(cell => cell.trim()));
      if (hasContent && JSON.stringify(rows) !== JSON.stringify(value)) {
        onSave(rows);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [rows, value, onSave]);

  useEffect(() => {
    return debouncedSave();
  }, [debouncedSave]);

  const addRow = () => {
    setRows([...rows, columns.map(() => '')]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    }
  };

  const updateCell = (rowIndex: number, colIndex: number, newValue: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = newValue;
    setRows(newRows);
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
                  className="text-left text-xs font-medium text-muted-foreground pb-2 px-2"
                >
                  {col}
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="border-gold/20 focus:border-gold text-sm"
                      placeholder={`${columns[colIndex]}...`}
                    />
                  </td>
                ))}
                <td className="p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(rowIndex)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={rows.length <= 1}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="border-gold/20 hover:bg-gold/5 text-sm"
        >
          <Plus size={14} className="mr-1" />
          Adicionar linha
        </Button>
        <div className="flex items-center gap-1">
          {isSaving && <Loader2 size={14} className="animate-spin text-gold" />}
          {showSaved && !isSaving && (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <Check size={14} />
              <span>Salvo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
