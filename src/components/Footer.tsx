

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Title */}
          <div className="text-center space-y-6 mb-8">
            <h3 className="text-3xl font-display text-background">
              EMPODHERA
            </h3>
            <div className="w-16 h-px bg-gold mx-auto" />
          </div>


          {/* Copyright */}
          <div className="text-center text-background/70 text-sm space-y-2">
            <p>© 2025 EMPODHERA. Todos os direitos reservados.</p>
            <p>Evento idealizado por Samira Gouvêa, Simone Ribeiro e Sueli Rocha.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
