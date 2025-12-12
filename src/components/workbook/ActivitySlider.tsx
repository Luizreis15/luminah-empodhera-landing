import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Check, Loader2 } from 'lucide-react';

interface ActivitySliderProps {
  id: string;
  title: string;
  min?: number;
  max?: number;
  value?: number;
  onSave: (value: number) => void;
  isSaving?: boolean;
}

export function ActivitySlider({
  id,
  title,
  min = 1,
  max = 10,
  value: initialValue = 5,
  onSave,
  isSaving = false
}: ActivitySliderProps) {
  const [value, setValue] = useState(initialValue);
  const [showSaved, setShowSaved] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

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
    }, 800);

    return () => clearTimeout(timer);
  }, [value, hasChanged, initialValue, onSave]);

  const handleChange = (newValue: number[]) => {
    setValue(newValue[0]);
    setHasChanged(true);
  };

  // Color based on value
  const getColor = () => {
    if (value <= 3) return 'text-red-500';
    if (value <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getEmoji = () => {
    if (value <= 3) return '😔';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '🌟';
  };

  return (
    <div className="py-3 px-4 bg-white/50 rounded-lg border border-gold/10">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-foreground" htmlFor={id}>
          {title}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getEmoji()}</span>
          <span className={`text-lg font-bold ${getColor()}`}>{value}</span>
          {isSaving ? (
            <Loader2 size={14} className="animate-spin text-muted-foreground" />
          ) : showSaved ? (
            <Check size={14} className="text-green-600" />
          ) : null}
        </div>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={handleChange}
        className="cursor-pointer"
      />
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
