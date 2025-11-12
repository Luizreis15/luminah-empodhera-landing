import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-10 md:py-12 bg-gradient-to-br from-gold-hover to-gold relative overflow-hidden">
      {/* Decorative animated elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-foreground/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Sparkle effects */}
      <div className="absolute top-10 right-1/4 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 right-10 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight">
            Sua Jornada de Transformação
            <br />
            <span className="font-bold">Começa Aqui</span>
          </h2>
          
          <p className="text-base md:text-lg lg:text-xl text-primary-foreground/90 leading-relaxed px-4">
            Não deixe que o medo da invisibilidade te impeça de alcançar seus sonhos. 
            O EMPODHERA é o seu ponto de partida para uma nova história de sucesso.
          </p>

          <div className="space-y-4 pt-6">
            <Button
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-white px-12 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-elegant transition-all duration-500 hover:scale-110"
              onClick={() => window.open('https://wa.me/5511999999999?text=Quero%20garantir%20minha%20vaga%20no%20EMPODHERA!', '_blank')}
            >
              Quero participar do EMPODHERA
            </Button>
            
            <p className="text-sm text-primary-foreground/80">
              "Evento idealizado por Samira Gouvêa e Simone Ribeiro"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
