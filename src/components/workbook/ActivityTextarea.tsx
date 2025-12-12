import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Check, Loader2 } from 'lucide-react';

interface ActivityTextareaProps {
  id: string;
  title?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onSave: (value: string) => void;
  isSaving?: boolean;
}

export function ActivityTextarea({
  id,
  title,
  placeholder,
  rows = 4,
  value: initialValue = '',
  onSave,
  isSaving = false
}: ActivityTextareaProps) {
  const [value, setValue] = useState(initialValue);
  const [showSaved, setShowSaved] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Update local value when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Debounced save
  useEffect(() => {
    if (!hasChanged) return;

    const timer = setTimeout(() => {
      if (value !== initialValue) {
        onSave(value);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [value, hasChanged, initialValue, onSave]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setHasChanged(true);
  };

  return (
    <div className="space-y-2">
      {title && (
        <label className="block text-sm font-medium text-foreground">
          {title}
        </label>
      )}
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className="resize-none border-gold/20 focus:border-gold focus:ring-gold/20 bg-white/50 transition-all"
        />
        {/* Save indicator */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {isSaving ? (
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Loader2 size={12} className="animate-spin" />
              <span>Salvando...</span>
            </div>
          ) : showSaved ? (
            <div className="flex items-center gap-1 text-green-600 text-xs animate-fade-in">
              <Check size={12} />
              <span>Salvo</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
