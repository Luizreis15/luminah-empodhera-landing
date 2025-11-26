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
    <section className="py-10 md:py-12 bg-gradient-gold relative overflow-hidden" id="investimento">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary-foreground drop-shadow-lg">
              Investimento na Sua Transformação
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Uma oportunidade exclusiva de investir no seu crescimento pessoal e profissional
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in border-4 border-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-500 hover:scale-105">
            <div className="space-y-8">
              {/* Price */}
              <div className="text-center space-y-4">
                <div className="inline-block px-6 py-2 bg-gold/10 rounded-full mb-2">
                  <span className="text-sm font-semibold text-gold uppercase tracking-wider">Investimento</span>
                </div>
                <div className="inline-flex items-center gap-3 text-6xl md:text-7xl font-display text-foreground">
                  <span>R$</span>
                  <span className="font-bold text-gold">350</span>
                  <span className="text-3xl">,00</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <CreditCard className="w-5 h-5" />
                  <p className="text-lg">Pagamento em até 3x sem juros</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full">
                  <span className="text-sm font-semibold text-gold">Vagas limitadas a 30 mulheres</span>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gold font-semibold">O que está incluído</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gold/5 hover:bg-gold/10 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-foreground/90 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button
                  size="lg"
                  className="w-full text-lg font-bold bg-foreground text-white hover:bg-foreground/90 hover:scale-105 transition-all duration-500 shadow-2xl"
                  onClick={() => window.open("https://pay.hub.la/VkKZ7stbqTlmOdSI5w7q", "_blank")}
                >
                  Quero participar
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Clique para garantir sua vaga
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
