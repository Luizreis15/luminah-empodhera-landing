import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bodyText, ctaText, ctaLink } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!bodyText || bodyText.trim().length === 0) {
      throw new Error("O corpo do email é obrigatório");
    }

    const systemPrompt = `Você é um designer de emails premium especializado em criar templates HTML para email marketing elegantes e responsivos.

IDENTIDADE VISUAL EMPODHERA:
- Cor de fundo principal: #F6EFE8 (bege claro elegante)
- Cor primária/dourado: #A67C52
- Dourado hover: #C89F7A  
- Dourado claro: #ECD9C4
- Texto primário: #2C2420 (marrom escuro)
- Texto secundário: #5C524C
- Branco: #ffffff
- Fundo do footer: #2C2420

TIPOGRAFIA:
- Títulos: Georgia, serif (elegante, clássico)
- Corpo: 'Helvetica Neue', Arial, sans-serif (limpo, legível)

REGRAS:
1. SEMPRE inclua {{nome}} na saudação (será substituído pelo nome do contato)
2. Crie HTML responsivo que funcione em TODOS os clientes de email (Gmail, Outlook, Apple Mail)
3. Use tabelas para layout (compatibilidade máxima com emails)
4. Largura máxima do container: 600px
5. Header com gradiente dourado e logo "EMPODHERA"
6. Footer com fundo escuro e texto dourado
7. Botão CTA com gradiente dourado, texto branco, border-radius suave
8. Espaçamento generoso, linha de texto 1.8
9. Retorne APENAS o código HTML completo, sem explicações

ESTRUTURA DO EMAIL:
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>CSS inline</style>
</head>
<body>
  <div class="container">
    <div class="header">EMPODHERA</div>
    <div class="content">
      <h2>Olá, {{nome}}!</h2>
      [CONTEÚDO CONVERTIDO]
      [BOTÃO CTA SE FORNECIDO]
    </div>
    <div class="footer">
      EMPODHERA
      Conectando mulheres, gerando negócios
    </div>
  </div>
</body>
</html>`;

    const userPrompt = `Converta este conteúdo em um email HTML premium EMPODHERA:

CORPO DO EMAIL:
${bodyText}

${ctaText && ctaLink ? `BOTÃO CTA:
Texto: ${ctaText}
Link: ${ctaLink}` : 'SEM BOTÃO CTA'}

Retorne APENAS o código HTML completo.`;

    console.log("Generating email HTML with Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos à sua conta." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let htmlContent = data.choices?.[0]?.message?.content || "";
    
    // Clean up the response - remove markdown code blocks if present
    htmlContent = htmlContent.replace(/```html\n?/gi, "").replace(/```\n?/gi, "").trim();
    
    console.log("Email HTML generated successfully");

    return new Response(JSON.stringify({ html: htmlContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in generate-email-html:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao gerar HTML";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
