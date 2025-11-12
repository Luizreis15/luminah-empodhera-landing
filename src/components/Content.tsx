import { Award, Brain, Camera, Heart, Lightbulb, Network } from "lucide-react";

const Content = () => {
  const experiences = [
    {
      icon: Award,
      title: "Posicionamento & Imagem",
      description: "Destaque-se com presença e autoridade",
    },
    {
      icon: Heart,
      title: "Branding Pessoal",
      description: "Construa uma marca que vende e inspira",
    },
    {
      icon: Lightbulb,
      title: "Autoridade Digital",
      description: "Atraia os clientes certos com autenticidade",
    },
    {
      icon: Network,
      title: "Networking Estratégico",
      description: "Conexões que viram oportunidades reais",
    },
    {
      icon: Brain,
      title: "Jantar Premium",
      description: "Menu completo em ambiente elegante",
    },
    {
      icon: Camera,
      title: "Fotografia Profissional",
      description: "Reforce sua imagem nas redes sociais",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-background to-gold-light/20 relative" id="conteudo">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display text-foreground">
              O que você vai viver no<br />
              <span className="text-gold">EMPODHERA</span>
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Experiences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience, index) => {
              const Icon = experience.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-xl shadow-soft hover:shadow-elegant transition-smooth border border-border hover:border-2 hover:border-gold animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center group-hover:scale-110 transition-smooth shadow-elegant">
                      <Icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-display text-foreground font-medium">
                      {experience.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="text-center pt-8">
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Uma experiência completa desenhada para mulheres que buscam elevar sua presença,
              autoridade e resultados no mundo dos negócios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
