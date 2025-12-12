import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ModuleCardProps {
  moduleId: number;
  title: string;
  subtitle: string;
  progress: number;
}

export function ModuleCard({ moduleId, title, subtitle, progress }: ModuleCardProps) {
  const isComplete = progress >= 100;

  return (
    <Link
      to={`/modulo/${moduleId}`}
      className="group block"
    >
      <div className="relative bg-card rounded-lg border border-gold/20 p-6 shadow-soft hover:shadow-elegant transition-all duration-300 hover:border-gold/40 overflow-hidden">
        {/* Module number badge */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
          <span className="text-gold font-display text-lg">{moduleId}</span>
        </div>

        {/* Content */}
        <div className="pr-12">
          <h3 className="font-display text-xl text-foreground mb-1 group-hover:text-gold transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {subtitle}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progresso</span>
            <span className="text-xs font-medium text-gold">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-gold rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Complete indicator or arrow */}
        <div className="mt-4 flex items-center justify-between">
          {isComplete ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">Completo</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              {progress > 0 ? 'Continuar' : 'Começar'}
            </span>
          )}
          <ArrowRight 
            size={18} 
            className="text-gold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}
