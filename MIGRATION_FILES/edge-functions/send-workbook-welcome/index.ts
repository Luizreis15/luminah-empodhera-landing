import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const firstName = name.split(" ")[0];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vinda ao Caderno de Atividades EMPODHERA</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #1a1a2e; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a2e; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <h1 style="font-size: 36px; color: #c9a227; margin: 0; letter-spacing: 4px;">EMPODHERA</h1>
              <p style="color: #888; font-size: 12px; letter-spacing: 2px; margin-top: 8px;">CADERNO DE ATIVIDADES</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(201, 162, 39, 0.2);">
              <h2 style="color: #c9a227; font-size: 24px; margin: 0 0 20px 0;">Olá, ${firstName}! ✨</h2>
              
              <p style="color: #ffffff; line-height: 1.8; margin-bottom: 20px;">
                Seja muito bem-vinda ao <strong style="color: #c9a227;">Caderno de Atividades EMPODHERA</strong>!
              </p>
              
              <p style="color: #cccccc; line-height: 1.8; margin-bottom: 20px;">
                Este é o seu espaço de reflexão e crescimento. Aqui você vai encontrar atividades práticas para descobrir seu posicionamento, construir sua marca pessoal e criar uma presença digital autêntica.
              </p>
              
              <p style="color: #cccccc; line-height: 1.8; margin-bottom: 30px;">
                O caderno está organizado em 4 módulos pensados para guiar sua jornada de empoderamento. Trabalhe no seu ritmo e lembre-se: cada resposta que você escreve é um passo em direção à sua melhor versão.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://atividades.empodhera.com/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #c9a227 0%, #8b7355 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      Acessar meu Caderno
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #888888; font-size: 14px; line-height: 1.6; margin-top: 30px; border-top: 1px solid rgba(201, 162, 39, 0.2); padding-top: 20px;">
                Se tiver qualquer dúvida, estamos aqui para ajudar. Basta responder este email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 40px;">
              <p style="color: #c9a227; font-style: italic; margin-bottom: 10px;">
                "A jornada de mil milhas começa com um único passo."
              </p>
              <p style="color: #666666; font-size: 12px;">
                Com carinho,<br>
                Equipe EMPODHERA
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

    console.log("Sending welcome email to:", email);

    const emailResponse = await resend.emails.send({
      from: "EMPODHERA <contato@empodhera.com>",
      to: [email],
      subject: `Bem-vinda ao Caderno de Atividades, ${firstName}! ✨`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

Deno.serve(handler);
