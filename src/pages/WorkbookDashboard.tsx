import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { WorkbookHeader } from '@/components/workbook/WorkbookHeader';
import { ModuleCard } from '@/components/workbook/ModuleCard';
import { ProgressBar } from '@/components/workbook/ProgressBar';
import { useWorkbookAuth, useWorkbookProgress } from '@/hooks/useWorkbook';
import { workbookModules } from '@/data/workbookModules';

export default function WorkbookDashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useWorkbookAuth();
  const { progress, totalProgress, isLoading: progressLoading } = useWorkbookProgress();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/caderno/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.name?.split(' ')[0] || 'Participante';

  return (
    <div className="min-h-screen bg-background">
        <WorkbookHeader />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Welcome Section */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-display text-foreground mb-2">
              Olá, <span className="text-gold">{userName}</span>! ✨
            </h1>
            <p className="text-muted-foreground">
              Continue sua jornada de empoderamento
            </p>
          </div>

          {/* Global Progress */}
          <div className="bg-card rounded-xl border border-gold/20 p-6 mb-10 shadow-soft animate-scale-in">
            <h2 className="font-display text-xl text-foreground mb-4">
              Seu Progresso Geral
            </h2>
            <ProgressBar 
              progress={totalProgress} 
              label="Caderno completo"
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {totalProgress < 25 && "Você está começando sua jornada. Continue!"}
              {totalProgress >= 25 && totalProgress < 50 && "Ótimo progresso! Continue explorando."}
              {totalProgress >= 50 && totalProgress < 75 && "Você está na metade do caminho! 🎉"}
              {totalProgress >= 75 && totalProgress < 100 && "Quase lá! Você está arrasando!"}
              {totalProgress >= 100 && "Parabéns! Você completou o caderno! 🏆"}
            </p>
          </div>

          {/* Module Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {workbookModules.map((module, index) => (
              <div 
                key={module.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ModuleCard
                  moduleId={module.id}
                  title={module.title}
                  subtitle={module.subtitle}
                  progress={progress[module.id] || 0}
                />
              </div>
            ))}
          </div>

          {/* Motivational Footer */}
          <div className="mt-12 text-center py-8 border-t border-gold/10">
            <p className="font-display text-lg text-gold italic">
              "Cada resposta que você escreve é um passo em direção à sua melhor versão."
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              — Equipe EMPODHERA
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
