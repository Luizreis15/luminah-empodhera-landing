import speaker1 from "@/assets/speaker-placeholder-1.jpg";
import speaker2 from "@/assets/speaker-placeholder-2.jpg";
import speaker3 from "@/assets/speaker-placeholder-3.jpg";
import speaker4 from "@/assets/speaker-placeholder-4.jpg";

const speakers = [
  {
    image: speaker1,
    name: "A Confirmar",
    specialty: "Especialista em Branding e Posicionamento Digital",
  },
  {
    image: speaker2,
    name: "A Confirmar",
    specialty: "Estrategista de Negócios e Liderança Feminina",
  },
  {
    image: speaker3,
    name: "A Confirmar",
    specialty: "Expert em Marketing de Influência e Autoridade",
  },
  {
    image: speaker4,
    name: "A Confirmar",
    specialty: "Mentora de Empreendedorismo e Networking",
  },
];

const Speakers = () => {
  return (
    <section className="py-8 bg-gradient-to-b from-gold-light/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold-hover/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-4xl md:text-5xl font-display text-foreground">
            Vozes que Inspiram
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça as palestrantes que compartilharão suas experiências e estratégias de sucesso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="group text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative inline-block mb-4">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gold transition-all duration-500 group-hover:scale-105 group-hover:border-gold-hover relative">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="absolute inset-0 rounded-full ring-4 ring-gold/50 animate-pulse-gold" />
              </div>
              
              <h3 className="text-xl font-display text-foreground mb-2 group-hover:text-gold transition-colors duration-300">
                {speaker.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                {speaker.specialty}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-muted-foreground italic">
            *Programação em finalização. Palestrantes serão confirmadas em breve.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
