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
    <section className="py-16 bg-background-secondary overlay-gold relative overflow-hidden" id="investimento">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display text-foreground">
              Ingresso & Vagas Limitadas
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-gold rounded-2xl shadow-elegant p-8 md:p-12 border-2 border-gold-hover animate-scale-in">
            <div className="space-y-8">
              {/* Price */}
              <div className="text-center space-y-4">
                <div className="inline-block px-6 py-2 bg-white/20 rounded-full mb-2">
                  <span className="text-sm font-semibold text-primary-foreground uppercase tracking-wider">Investimento</span>
                </div>
                <div className="inline-flex items-center gap-3 text-6xl md:text-7xl font-display text-primary-foreground">
                  <span>R$</span>
                  <span className="font-bold">350</span>
                  <span className="text-3xl">,00</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
                  <CreditCard className="w-5 h-5" />
                  <p className="text-lg">Pagamento em até 3x sem juros</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                  <span className="text-sm font-semibold text-primary-foreground">Vagas limitadas a 30 mulheres</span>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gold px-4 text-primary-foreground font-semibold">O que está incluído</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-smooth"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-primary-foreground/90 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button
                  variant="elegant"
                  size="lg"
                  className="w-full text-lg shadow-elegant hover:shadow-2xl"
                  onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                >
                  Quero participar
                </Button>
                <p className="text-center text-sm text-primary-foreground/80 mt-4">
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
