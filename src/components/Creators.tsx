import samiraImage from "@/assets/samira-portrait.jpg";
import simoneImage from "@/assets/simone-portrait.jpg";

const Creators = () => {
  const creators = [
    {
      name: "Samira Gouvêa",
      image: samiraImage,
      bio: [
        "Empresária multinegócios, fundadora da Hera Digital.",
        "Especialista em posicionamento e transformação de marcas, Samira já reestruturou empresas que estavam em declínio e as levou a um novo patamar de prosperidade.",
        "Casada, mãe e apaixonada por ajudar outras mulheres a conquistarem espaço com autenticidade.",
      ],
    },
    {
      name: "Simone Ribeiro",
      image: simoneImage,
      bio: [
        "Empresária, educadora e multigestora nos ramos de educação, logística e construção.",
        "Reconhecida por sua visão estratégica, liderança e amor por conectar pessoas e negócios.",
        "Casada, mãe dedicada e inspiradora por natureza.",
      ],
    },
  ];

  return (
    <section className="py-16 bg-dark-elegant relative overflow-hidden" id="criadoras">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display text-gold">
              As Mulheres por Trás do Movimento
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {creators.map((creator, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-6 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Portrait */}
                <div className="relative group">
                  <div className="w-64 h-64 rounded-full overflow-hidden shadow-elegant group-hover:scale-105 transition-smooth">
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 ring-[6px] ring-gold rounded-full group-hover:ring-gold-hover transition-smooth animate-pulse" />
                  <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-smooth rounded-full" />
                </div>

                {/* Name */}
                <h3 className="text-3xl font-display text-gold-hover">{creator.name}</h3>

                {/* Bio */}
                <div className="space-y-4 max-w-md">
                  {creator.bio.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-primary-foreground/90 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Connection Quote */}
          <div className="text-center pt-12">
            <blockquote className="text-xl md:text-2xl font-display text-gold-hover italic max-w-3xl mx-auto leading-relaxed">
              "Juntas, criaram o EMPODHERA para unir propósito, imagem e prosperidade — elevando
              mulheres que decidem brilhar."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Creators;
