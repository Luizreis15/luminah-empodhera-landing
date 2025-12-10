import { Button } from "@/components/ui/button";
import { Bell, Flame, Clock, Crown, Sparkles, TrendingUp } from "lucide-react";
import { WaitingListDialog } from "./WaitingListDialog";

const SuccessSection = () => {
  const nextEditionBenefits = [
    { icon: Sparkles, text: "Mais palestrantes de peso" },
    { icon: TrendingUp, text: "Mais vagas disponíveis" },
    { icon: Crown, text: "Mais oportunidades de networking" },
  ];

  return (
    <section className="py-10 md:py-12 bg-gradient-gold relative overflow-hidden" id="sucesso">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-destructive/10 rounded-full border-2 border-destructive/30 animate-pulse">
              <Flame className="w-5 h-5 text-destructive" />
              <span className="text-lg font-bold text-destructive uppercase tracking-wider">
                Esgotado em tempo recorde
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in border-4 border-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-500">
            <div className="space-y-8">
              {/* Headline */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
                  A 1ª edição do EMPODHERA esgotou{" "}
                  <span className="text-gold">em menos de 7 dias.</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Isso prova que mulheres como você reconhecem uma oportunidade única quando veem uma.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-5 rounded-xl bg-gold/10 hover:bg-gold/15 transition-all duration-300 border border-gold/20">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gold">&lt; 7 dias</p>
                    <p className="text-sm text-muted-foreground">para esgotar todas as vagas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-5 rounded-xl bg-gold/10 hover:bg-gold/15 transition-all duration-300 border border-gold/20">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gold">Edição exclusiva</p>
                    <p className="text-sm text-muted-foreground">de lançamento curada</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gold font-semibold">O que vem por aí</span>
                </div>
              </div>

              {/* Next Edition Block */}
              <div className="text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  A próxima edição promete ser{" "}
                  <span className="text-gold">ainda maior</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {nextEditionBenefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gold/5 hover:bg-gold/10 transition-all duration-300"
                    >
                      <benefit.icon className="w-5 h-5 text-gold" />
                      <span className="text-foreground/90">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency Text */}
              <div className="text-center space-y-2 pt-4">
                <p className="text-lg font-medium text-foreground">
                  Não espere esgotar de novo.
                </p>
                <p className="text-muted-foreground">
                  Entre na lista de espera e seja notificada antes de todo mundo quando as vagas abrirem.
                </p>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <WaitingListDialog>
                  <Button
                    size="lg"
                    className="w-full text-lg font-bold bg-foreground text-white hover:bg-foreground/90 hover:scale-105 transition-all duration-500 shadow-2xl"
                  >
                    <Bell className="mr-2 h-5 w-5" />
                    Quero ser a primeira a saber
                  </Button>
                </WaitingListDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessSection;
