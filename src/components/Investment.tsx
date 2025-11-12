import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";

const Investment = () => {
  const benefits = [
    "Clareza de posicionamento",
    "Estratégias aplicáveis no dia seguinte",
    "Parcerias e indicações",
    "Fotos e networking de alto valor",
    "Jantar completo + palestras",
    "Material digital exclusivo",
  ];

  return (
    <section className="py-24 bg-background-secondary" id="investimento">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display text-foreground">
              Ingresso & Vagas Limitadas
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-2xl shadow-elegant p-8 md:p-12 border-2 border-gold animate-scale-in">
            <div className="space-y-8">
              {/* Price */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 text-6xl md:text-7xl font-display text-foreground">
                  <span className="text-gold">R$</span>
                  <span className="font-bold">350</span>
                  <span className="text-3xl text-muted-foreground">,00</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-foreground/70">
                  <CreditCard className="w-5 h-5 text-gold" />
                  <p className="text-lg">Pagamento em até 3x sem juros</p>
                </div>
                <p className="text-lg font-semibold text-gold">
                  Vagas limitadas a 30 mulheres
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">O que está incluído</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg hover:bg-background-secondary transition-smooth"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-light flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button
                  variant="premium"
                  size="lg"
                  className="w-full text-lg"
                  onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                >
                  Quero participar
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Clique para garantir sua vaga pelo WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-4 pt-8">
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Um investimento que retorna em conexões, conhecimento e transformação para o seu negócio e sua marca pessoal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Investment;
