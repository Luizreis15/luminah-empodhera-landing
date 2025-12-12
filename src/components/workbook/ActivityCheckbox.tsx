import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Loader2 } from 'lucide-react';

interface ActivityCheckboxProps {
  id: string;
  options: string[];
  value: string[];
  onSave: (value: string[]) => void;
  isSaving: boolean;
}

export function ActivityCheckbox({ 
  id, 
  options, 
  value, 
  onSave, 
  isSaving 
}: ActivityCheckboxProps) {
  const [selected, setSelected] = useState<string[]>(value);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(s => s !== option)
      : [...selected, option];
    
    setSelected(newSelected);
    onSave(newSelected);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div 
          key={index}
          className="flex items-start gap-3 p-3 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors cursor-pointer"
          onClick={() => handleToggle(option)}
        >
          <Checkbox
            id={`${id}-${index}`}
            checked={selected.includes(option)}
            onCheckedChange={() => handleToggle(option)}
            className="mt-0.5 border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
          />
          <label 
            htmlFor={`${id}-${index}`}
            className="text-sm text-foreground cursor-pointer flex-1"
          >
            {option}
          </label>
        </div>
      ))}
      <div className="flex items-center justify-end gap-1 mt-2">
        {isSaving && <Loader2 size={14} className="animate-spin text-gold" />}
        {showSaved && !isSaving && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <Check size={14} />
            <span>Salvo</span>
          </div>
        )}
      </div>
    </div>
  );
}
