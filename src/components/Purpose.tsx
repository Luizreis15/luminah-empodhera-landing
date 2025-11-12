import { Sparkles, Target, Users, TrendingUp } from "lucide-react";

const Purpose = () => {
  const benefits = [
    {
      icon: Target,
      title: "Reposicionamento",
      description: "Com elegância e autenticidade",
    },
    {
      icon: Sparkles,
      title: "Branding Pessoal",
      description: "Que gera lembrança e desejo",
    },
    {
      icon: TrendingUp,
      title: "Estratégias Digitais",
      description: "Aplicáveis e eficazes",
    },
    {
      icon: Users,
      title: "Networking Premium",
      description: "Com mulheres que fazem acontecer",
    },
  ];

  return (
    <section className="py-6 bg-background-secondary pattern-dots relative overflow-hidden" id="proposito">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display text-foreground">
              Por que este encontro existe
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Main Text Block - Destacado */}
          <div className="bg-white rounded-2xl shadow-elegant p-8 md:p-12 border-2 border-gold/20 animate-scale-in max-w-4xl mx-auto">
            <div className="space-y-6 text-lg text-foreground/80 leading-relaxed text-center">
              <p>
                O <span className="font-semibold text-gold">EMPODHERA</span> nasceu para{" "}
                <span className="font-semibold text-foreground">acender o brilho de mulheres empreendedoras</span>{" "}
                e inspirar uma nova era de liderança feminina no ABC.
              </p>
              <p>
                Criado por <span className="font-semibold text-foreground">Samira Gouvêa</span> e{" "}
                <span className="font-semibold text-foreground">Simone Ribeiro</span>, o evento é um espaço de
                transformação, propósito e conexão — onde negócios, imagem e valores se unem para gerar resultados reais.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-white rounded-xl shadow-soft hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 border-2 border-transparent hover:border-gold relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gold-light flex items-center justify-center group-hover:scale-110 transition-smooth">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-display text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Purpose;
