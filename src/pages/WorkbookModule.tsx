import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkbookHeader } from '@/components/workbook/WorkbookHeader';
import { ProgressBar } from '@/components/workbook/ProgressBar';
import { QuoteBlock } from '@/components/workbook/QuoteBlock';
import { ActivityTextarea } from '@/components/workbook/ActivityTextarea';
import { ActivitySlider } from '@/components/workbook/ActivitySlider';
import { ActivityTable } from '@/components/workbook/ActivityTable';
import { ActivityCheckbox } from '@/components/workbook/ActivityCheckbox';
import { useWorkbookAuth, useWorkbookResponses, useWorkbookProgress } from '@/hooks/useWorkbook';
import { workbookModules } from '@/data/workbookModules';

export default function WorkbookModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useWorkbookAuth();
  
  const currentModuleId = parseInt(moduleId || '1', 10);
  const module = workbookModules.find(m => m.id === currentModuleId);
  
  const { responses, isLoading: responsesLoading, isSaving, saveResponse } = useWorkbookResponses(currentModuleId);
  const { progress } = useWorkbookProgress();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/caderno');
    }
  }, [user, authLoading, navigate]);

  // Redirect if invalid module
  useEffect(() => {
    if (!module) {
      navigate('/caderno/dashboard');
    }
  }, [module, navigate]);

  if (authLoading || responsesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user || !module) return null;

  const prevModule = currentModuleId > 1 ? currentModuleId - 1 : null;
  const nextModule = currentModuleId < 4 ? currentModuleId + 1 : null;

  const renderActivity = (activity: any) => {
    const value = responses[activity.id];

    switch (activity.type) {
      case 'textarea':
        return (
          <ActivityTextarea
            key={activity.id}
            id={activity.id}
            title={activity.title}
            placeholder={activity.placeholder}
            rows={activity.rows}
            value={typeof value === 'string' ? value : ''}
            onSave={(val) => saveResponse(activity.id, val)}
            isSaving={isSaving}
          />
        );
      case 'slider':
        return (
          <ActivitySlider
            key={activity.id}
            id={activity.id}
            title={activity.title || ''}
            min={activity.min}
            max={activity.max}
            value={typeof value === 'number' ? value : 5}
            onSave={(val) => saveResponse(activity.id, val)}
            isSaving={isSaving}
          />
        );
      case 'table':
        return (
          <ActivityTable
            key={activity.id}
            id={activity.id}
            columns={activity.columns || []}
            value={Array.isArray(value) ? value : []}
            onSave={(val) => saveResponse(activity.id, val)}
            isSaving={isSaving}
          />
        );
      case 'checkbox':
        return (
          <ActivityCheckbox
            key={activity.id}
            id={activity.id}
            options={activity.options || []}
            value={Array.isArray(value) ? value : []}
            onSave={(val) => saveResponse(activity.id, val)}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen bg-background">
        <WorkbookHeader />

        {/* Module Progress Bar */}
        <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur border-b border-gold/10 py-3">
          <div className="container mx-auto px-4 max-w-3xl">
            <ProgressBar 
              progress={progress[currentModuleId] || 0} 
              label={`Módulo ${currentModuleId}: ${module.title}`}
              size="sm"
            />
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Module Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-display text-lg font-medium">
                {module.id}
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-display text-foreground">
                  {module.title}
                </h1>
                <p className="text-foreground/70">{module.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          {module.quote && (
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <QuoteBlock text={module.quote.text} author={module.quote.author} />
            </div>
          )}

          {/* Sections */}
          {module.sections.map((section, sectionIndex) => (
            <section 
              key={sectionIndex}
              className="mb-10 bg-card rounded-xl border border-gold/20 p-6 shadow-soft animate-fade-in"
              style={{ animationDelay: `${(sectionIndex + 1) * 100}ms` }}
            >
              <h2 className="font-display text-xl text-foreground mb-2">
                {section.title}
              </h2>
              {section.description && (
                <p className="text-foreground/70 text-sm mb-6">
                  {section.description}
                </p>
              )}

              <div className="space-y-6">
                {section.activities.map((activity) => renderActivity(activity))}
              </div>
            </section>
          ))}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gold/10">
            {prevModule ? (
              <Link to={`/caderno/modulo/${prevModule}`}>
                <Button variant="outline" className="border-gold/20 hover:bg-gold/5">
                  <ChevronLeft size={18} className="mr-1" />
                  Módulo {prevModule}
                </Button>
              </Link>
            ) : (
              <Link to="/caderno/dashboard">
                <Button variant="outline" className="border-gold/20 hover:bg-gold/5">
                  <ChevronLeft size={18} className="mr-1" />
                  Dashboard
                </Button>
              </Link>
            )}

            {nextModule ? (
              <Link to={`/caderno/modulo/${nextModule}`}>
                <Button className="bg-gradient-gold text-white hover:opacity-90">
                  Módulo {nextModule}
                  <ChevronRight size={18} className="ml-1" />
                </Button>
              </Link>
            ) : (
              <Link to="/caderno/dashboard">
                <Button className="bg-gradient-gold text-white hover:opacity-90">
                  Concluir
                  <ChevronRight size={18} className="ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>
  );
}
