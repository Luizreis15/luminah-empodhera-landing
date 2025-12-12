import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Check, Loader2 } from 'lucide-react';

interface ActivitySliderProps {
  id: string;
  title: string;
  min?: number;
  max?: number;
  value: number;
  onSave: (value: number) => void;
  isSaving: boolean;
}

export function ActivitySlider({ 
  id, 
  title, 
  min = 1, 
  max = 10, 
  value, 
  onSave, 
  isSaving 
}: ActivitySliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number[]) => {
    const val = newValue[0];
    setLocalValue(val);
  };

  const handleCommit = (newValue: number[]) => {
    const val = newValue[0];
    if (val !== value) {
      onSave(val);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {title}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-lg font-display text-gold w-8 text-center">
            {localValue}
          </span>
          {isSaving && <Loader2 size={14} className="animate-spin text-gold" />}
          {showSaved && !isSaving && <Check size={14} className="text-green-600" />}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{min}</span>
        <Slider
          value={[localValue]}
          onValueChange={handleChange}
          onValueCommit={handleCommit}
          min={min}
          max={max}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground">{max}</span>
      </div>
    </div>
  );
}
