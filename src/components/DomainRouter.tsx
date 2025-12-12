import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Index from "@/pages/Index";

const DomainRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Se acessar via atividades.empodhera.com, redireciona para o Caderno
    if (hostname === "atividades.empodhera.com") {
      navigate("/caderno", { replace: true });
    }
  }, [navigate]);

  // Se não for redirecionado, mostra a página Index normal
  return <Index />;
};

export default DomainRouter;
