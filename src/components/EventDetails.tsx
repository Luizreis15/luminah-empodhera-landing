import { Calendar, Clock, MapPin, Shirt } from "lucide-react";

const EventDetails = () => {
  const details = [
    {
      icon: Calendar,
      label: "Data",
      value: "15 de Dezembro de 2025",
    },
    {
      icon: Clock,
      label: "Horário",
      value: "18h30 – 22h30",
    },
    {
      icon: MapPin,
      label: "Local",
      value: "Coco Bambu Santo André",
    },
    {
      icon: Shirt,
      label: "Traje",
      value: "Elegante casual",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display text-foreground">
              Informações Práticas
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-card rounded-xl shadow-soft hover:shadow-elegant transition-smooth border border-border hover:border-gold animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gold-light flex items-center justify-center group-hover:scale-110 transition-smooth">
                      <Icon className="w-7 h-7 text-gold" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {detail.label}
                      </p>
                      <p className="text-xl font-display text-foreground">{detail.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Note */}
          <div className="text-center pt-8 space-y-4">
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Leve cartões de visita ou QR code para facilitar conexões.
            </p>
            <p className="text-muted-foreground">
              Prepare-se para uma noite memorável de networking e transformação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
