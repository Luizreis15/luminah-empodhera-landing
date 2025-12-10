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

    const systemPrompt = `Você é um designer de emails premium especializado em criar templates HTML para email marketing ultra-elegantes e responsivos.

IDENTIDADE VISUAL EMPODHERA (Jantar Exclusivo para Mulheres Empreendedoras):
- Fundo do body: #1A1A1A (preto sofisticado)
- Container principal: gradiente de #2A2A2A para #1A1A1A com borda dourada
- Cor primária/dourado: #D4AF37
- Dourado secundário: #B8860B
- Dourado claro para highlights: rgba(212, 175, 55, 0.1)
- Texto principal: #FFFFFF
- Texto secundário: #E5E5E5
- Texto muted: #888888
- Bordas e separadores: #333333

TIPOGRAFIA:
- Títulos: Georgia, serif (elegante, clássico) - cor dourada #D4AF37
- Corpo: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif
- Letter-spacing em títulos: 2px para EMPODHERA

ESTRUTURA OBRIGATÓRIA:
1. HEADER sofisticado com:
   - Logo "EMPODHERA" em dourado com letter-spacing
   - Subtítulo "JANTAR EXCLUSIVO PARA MULHERES" em dourado secundário
   
2. CONTENT area com:
   - Saudação personalizada "Olá, {{nome}}! ✨" 
   - Conteúdo do email com parágrafos bem espaçados (line-height: 1.8)
   - Destaques importantes em dourado
   - Quote boxes com borda lateral dourada e fundo semi-transparente

3. BOTÃO CTA (se fornecido):
   - Background gradiente dourado (#D4AF37 para #B8860B)
   - Texto branco, bold
   - Border-radius 8px
   - Padding generoso (16px 32px)
   - Sombra sutil

4. SIGNATURE:
   - "Com carinho," em dourado secundário
   - "Samira, Simone & Sueli" em dourado
   - "Criadoras do EMPODHERA" em cinza

5. FOOTER:
   - Borda superior separadora
   - Texto de unsubscribe discreto em cinza
   - Link para remover da lista

REGRAS TÉCNICAS:
1. SEMPRE use {{nome}} na saudação (será substituído dinamicamente)
2. Use TABELAS para layout (compatibilidade com Outlook, Gmail, Apple Mail)
3. Largura máxima: 600px, centralizado
4. TODOS os estilos devem ser INLINE (não use <style> tags)
5. Imagens devem ter alt text
6. Padding interno generoso: 40px nas laterais
7. Retorne APENAS o código HTML completo, sem explicações ou markdown`;

    const userPrompt = `Crie um email HTML ultra-premium EMPODHERA com este conteúdo:

CORPO DO EMAIL:
${bodyText}

${ctaText && ctaLink ? `BOTÃO CTA:
Texto: ${ctaText}
Link: ${ctaLink}` : 'SEM BOTÃO CTA - não inclua nenhum botão'}

IMPORTANTE: 
- Retorne APENAS o código HTML puro, sem \`\`\`html ou explicações
- Todos os estilos INLINE
- Use tabelas para layout
- Saudação deve usar {{nome}}
- Visual dark theme luxuoso com dourado`;

    console.log("Generating premium email HTML with Lovable AI...");

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
