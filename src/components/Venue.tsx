import venueMain from "@/assets/venue-main.jpg";
import venueTable from "@/assets/venue-table.jpg";
import venueEntrance from "@/assets/venue-entrance.jpg";
import { MapPin } from "lucide-react";

const venueImages = [
  {
    image: venueMain,
    title: "Ambiente Sofisticado",
    description: "Espaço elegante e acolhedor, perfeito para networking",
  },
  {
    image: venueTable,
    title: "Detalhes Refinados",
    description: "Mesa posta com a qualidade Coco Bambu",
  },
  {
    image: venueEntrance,
    title: "Localização Premium",
    description: "Fácil acesso no coração de Santo André",
  },
];

const Venue = () => {
  return (
    <section className="py-8 bg-dark-elegant relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-10 right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold-hover/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Diagonal decorative lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-lg">
            O Ambiente Perfeito
          </h2>
          <div className="flex items-center gap-2 text-white text-lg justify-center drop-shadow-md">
            <MapPin className="w-5 h-5 text-gold" />
            <span>Coco Bambu - Santo André</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {venueImages.map((venue, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-elegant hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image container with zoom effect */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Golden border effect on hover */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-gold transition-all duration-500" />
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-display font-bold drop-shadow-lg mb-2">
                  {venue.title}
                </h3>
                <p className="text-sm text-white drop-shadow-md leading-relaxed">
                  {venue.description}
                </p>
              </div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-2 text-white text-lg drop-shadow-md">
            <MapPin className="w-5 h-5 text-gold" />
            <span>Alameda Vieira de Carvalho, 70 - Centro, Santo André - SP</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Venue;
