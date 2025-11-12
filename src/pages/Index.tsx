import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import Creators from "@/components/Creators";
import Speakers from "@/components/Speakers";
import Content from "@/components/Content";
import Venue from "@/components/Venue";
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
      <Speakers />
      <Content />
      <Venue />
      <Investment />
      <EventDetails />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
