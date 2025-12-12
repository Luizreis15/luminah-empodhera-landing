import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Check, Loader2 } from 'lucide-react';

interface ActivityTextareaProps {
  id: string;
  title?: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onSave: (value: string) => void;
  isSaving: boolean;
}

export function ActivityTextarea({ 
  id, 
  title, 
  placeholder, 
  rows = 4, 
  value, 
  onSave, 
  isSaving 
}: ActivityTextareaProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced save
  const debouncedSave = useCallback(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== value && localValue.trim()) {
        onSave(localValue);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [localValue, value, onSave]);

  useEffect(() => {
    return debouncedSave();
  }, [debouncedSave]);

  return (
    <div className="space-y-2">
      {title && (
        <label className="text-sm font-medium text-foreground">
          {title}
        </label>
      )}
      <div className="relative">
        <Textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="border-gold/20 focus:border-gold resize-none"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {isSaving && (
            <Loader2 size={14} className="animate-spin text-gold" />
          )}
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
