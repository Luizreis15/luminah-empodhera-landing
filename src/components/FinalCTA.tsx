import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-nude relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-hover rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-elegant">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-display text-foreground leading-tight">
              O sucesso é uma decisão —<br />
              <span className="text-gold">a sua começa aqui</span>
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Description */}
          <div className="space-y-6">
            <p className="text-2xl font-display text-foreground/90">
              EMPODHERA — Edição inaugural
            </p>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Uma noite que vai marcar sua trajetória como mulher, empreendedora e líder.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              variant="premium"
              size="lg"
              className="text-lg px-12"
              onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
            >
              Garanta sua vaga agora
            </Button>
          </div>

          {/* Event Info */}
          <div className="pt-12 space-y-4 text-foreground/70">
            <p className="text-lg font-display italic">
              "Evento idealizado por Samira Gouvêa e Simone Ribeiro"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
