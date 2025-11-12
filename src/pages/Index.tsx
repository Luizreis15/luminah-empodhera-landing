import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import Creators from "@/components/Creators";
import Content from "@/components/Content";
import Investment from "@/components/Investment";
import EventDetails from "@/components/EventDetails";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Purpose />
      <Creators />
      <Content />
      <Investment />
      <EventDetails />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
