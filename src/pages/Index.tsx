import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import Creators from "@/components/Creators";
import Content from "@/components/Content";
import Venue from "@/components/Venue";
import SuccessSection from "@/components/SuccessSection";
import EventDetails from "@/components/EventDetails";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Purpose />
      <Creators />
      <Content />
      <Venue />
      <SuccessSection />
      <EventDetails />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
