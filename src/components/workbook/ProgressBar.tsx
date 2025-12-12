interface ProgressBarProps {
  progress: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ progress, label, size = 'md' }: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-medium text-gold">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-muted rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div 
          className={`${heightClasses[size]} bg-gradient-gold rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
