import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-dining.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-nude">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Elegant dining experience"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-display font-light text-foreground tracking-wide">
              EMPODHERA
            </h1>
            <div className="w-32 h-1 bg-gold mx-auto" />
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl font-body text-foreground/80 max-w-2xl mx-auto leading-relaxed px-4">
            O Encontro das Mulheres que Decidiram Brilhar com Propósito e Autoridade
          </p>

          {/* Event Details */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-foreground/70 font-body">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              <span className="font-medium">15 de Dezembro, 2025</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gold" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="font-medium">Coco Bambu Santo André</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              variant="premium"
              size="lg"
              onClick={() => scrollToSection("investimento")}
              className="w-full sm:w-auto"
            >
              Garanta sua vaga agora
            </Button>
            <Button
              variant="elegant"
              size="lg"
              onClick={() => scrollToSection("conteudo")}
              className="w-full sm:w-auto"
            >
              Ver programação
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
