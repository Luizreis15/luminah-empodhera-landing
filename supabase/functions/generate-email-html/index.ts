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
- Fundo do body: #F6EFE8 (nude/bege elegante e suave)
- Container principal: #ffffff (branco) com border-radius: 16px e box-shadow sutil
- Header: gradiente de #A67C52 para #C89F7A (dourado quente sofisticado)
- Cor primária/dourada: #A67C52
- Dourado secundário: #C89F7A
- Dourado claro para destaques: #D4B896
- Texto principal: #2C2420 (marrom escuro elegante)
- Texto secundário: #5C524C (marrom médio)
- Texto muted: #8B7B6B
- Bordas e separadores: #E8DED4

TIPOGRAFIA:
- Títulos: Georgia, serif (elegante, clássico) - cor branca no header, marrom no corpo
- Corpo: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif
- Letter-spacing em títulos: 3px para EMPODHERA

ESTRUTURA OBRIGATÓRIA:
1. HEADER sofisticado com:
   - Background gradiente dourado (#A67C52 para #C89F7A)
   - Logo "EMPODHERA" em BRANCO com letter-spacing: 3px, font-size: 28px
   - Subtítulo "JANTAR EXCLUSIVO PARA MULHERES" em branco com opacidade 90%
   - Border-radius superior: 16px
   - Padding: 40px
   
2. CONTENT area com:
   - Fundo branco #ffffff
   - Saudação personalizada "Olá, {{nome}}! ✨" em marrom escuro #2C2420
   - Conteúdo do email com parágrafos bem espaçados (line-height: 1.8)
   - Destaques importantes em dourado #A67C52
   - Quote boxes com borda lateral dourada e fundo #FBF8F5
   - Padding: 40px

3. BOTÃO CTA (se fornecido):
   - Background gradiente dourado (#A67C52 para #C89F7A)
   - Texto branco #ffffff, bold
   - Border-radius 8px
   - Padding generoso (16px 40px)
   - Sombra: 0 4px 15px rgba(166, 124, 82, 0.3)

4. SIGNATURE:
   - "Com carinho," em dourado #A67C52
   - "Samira, Simone & Sueli" em marrom escuro #2C2420
   - "Criadoras do EMPODHERA" em cinza #8B7B6B

5. FOOTER:
   - Borda superior: 1px solid #E8DED4
   - Fundo branco com border-radius inferior: 16px
   - Texto de unsubscribe discreto em #8B7B6B
   - Padding: 24px 40px

REGRAS TÉCNICAS:
1. SEMPRE use {{nome}} na saudação (será substituído dinamicamente)
2. Use TABELAS para layout (compatibilidade com Outlook, Gmail, Apple Mail)
3. Largura máxima: 600px, centralizado
4. TODOS os estilos devem ser INLINE (não use <style> tags)
5. Imagens devem ter alt text
6. O visual deve ser CLARO, FEMININO, ACOLHEDOR e SOFISTICADO
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
