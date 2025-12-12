import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-workbook-welcome function started");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();
    console.log("Sending welcome email to:", email, "Name:", name);

    if (!email || !name) {
      throw new Error("Email and name are required");
    }

    const firstName = name.split(' ')[0];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1A1A1A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%); border: 1px solid #D4AF37; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #333;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 32px; color: #D4AF37; letter-spacing: 2px;">
                EMPODHERA
              </h1>
              <p style="margin: 8px 0 0; color: #B8860B; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">
                Caderno de Atividades
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-family: Georgia, serif; font-size: 24px; color: #FFFFFF;">
                Olá, ${firstName}! ✨
              </h2>
              
              <p style="margin: 0 0 20px; color: #E5E5E5; font-size: 16px; line-height: 1.8;">
                Seja muito bem-vinda ao <strong style="color: #D4AF37;">Caderno de Atividades EMPODHERA</strong>!
              </p>
              
              <p style="margin: 0 0 20px; color: #E5E5E5; font-size: 16px; line-height: 1.8;">
                Este é o seu espaço exclusivo para reflexão, planejamento e crescimento pessoal e profissional. Aqui você encontrará exercícios práticos que vão te ajudar a:
              </p>
              
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #E5E5E5; font-size: 16px; line-height: 2;">
                <li>Definir seu ponto de partida com clareza</li>
                <li>Descobrir seu posicionamento único no mercado</li>
                <li>Construir seu branding pessoal autêntico</li>
                <li>Criar uma estratégia de conteúdo para o Instagram</li>
              </ul>
              
              <!-- Quote Box -->
              <table role="presentation" style="width: 100%; margin: 30px 0; border-collapse: collapse;">
                <tr>
                  <td style="padding: 20px; background: rgba(212, 175, 55, 0.1); border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; font-family: Georgia, serif; font-style: italic; color: #FFFFFF; font-size: 16px;">
                      "A jornada de mil milhas começa com um único passo."
                    </p>
                    <p style="margin: 10px 0 0; color: #D4AF37; font-size: 14px;">
                      — Lao Tsé
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; color: #E5E5E5; font-size: 16px; line-height: 1.8;">
                Suas respostas são salvas automaticamente, então você pode fazer no seu ritmo. Volte quantas vezes quiser!
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="https://atividades.empodhera.com/caderno" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #FFFFFF; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                      Acessar Meu Caderno
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 5px; color: #B8860B; font-size: 16px;">
                Com carinho,
              </p>
              <p style="margin: 0 0 5px; color: #D4AF37; font-size: 18px; font-family: Georgia, serif;">
                Samira, Simone & Sueli
              </p>
              <p style="margin: 0; color: #888888; font-size: 14px;">
                Criadoras do EMPODHERA
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #333; text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                Você está recebendo este email porque se cadastrou no Caderno de Atividades EMPODHERA.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "EMPODHERA <onboarding@resend.dev>",
      to: [email],
      subject: `Bem-vinda ao Caderno de Atividades, ${firstName}! ✨`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-workbook-welcome function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
