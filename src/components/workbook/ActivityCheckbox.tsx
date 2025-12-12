import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Loader2 } from 'lucide-react';

interface ActivityCheckboxProps {
  id: string;
  options: string[];
  value?: string[];
  onSave: (value: string[]) => void;
  isSaving?: boolean;
}

export function ActivityCheckbox({
  id,
  options,
  value: initialValue = [],
  onSave,
  isSaving = false
}: ActivityCheckboxProps) {
  const [selected, setSelected] = useState<string[]>(initialValue);
  const [showSaved, setShowSaved] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  // Debounced save
  useEffect(() => {
    if (!hasChanged) return;

    const timer = setTimeout(() => {
      onSave(selected);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 800);

    return () => clearTimeout(timer);
  }, [selected, hasChanged, onSave]);

  const handleToggle = (option: string) => {
    setSelected(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      }
      return [...prev, option];
    });
    setHasChanged(true);
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <label
          key={index}
          className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-gold/10 hover:border-gold/30 cursor-pointer transition-all"
        >
          <Checkbox
            id={`${id}-${index}`}
            checked={selected.includes(option)}
            onCheckedChange={() => handleToggle(option)}
            className="mt-0.5 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
          />
          <span className="text-sm text-foreground leading-relaxed">
            {option}
          </span>
        </label>
      ))}

      {/* Save indicator */}
      <div className="flex items-center gap-1 text-xs justify-end">
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
        ) : (
          <span className="text-muted-foreground">
            {selected.length} de {options.length} selecionados
          </span>
        )}
      </div>
    </div>
  );
}
