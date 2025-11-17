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
    <section className="py-10 md:py-12 bg-dark-elegant relative overflow-hidden" id="criadoras">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
          {/* Header */}
          <div className="text-center space-y-4 md:space-y-6 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-gold">
              As Mulheres por Trás do Movimento
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {creators.map((creator, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 md:space-y-6 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Portrait */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-gold rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-gold" />
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-gold shadow-elegant group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className={`w-full h-full object-cover ${index === 0 ? 'object-[center_20%]' : 'object-[center_10%]'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl sm:text-3xl font-display text-gold-hover">{creator.name}</h3>

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
            <blockquote className="text-lg sm:text-xl md:text-2xl font-display text-gold-hover italic max-w-3xl mx-auto leading-relaxed px-4">
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
