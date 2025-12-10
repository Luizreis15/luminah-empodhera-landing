import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WaitingListConfirmationRequest {
  name: string;
  email: string;
  phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone }: WaitingListConfirmationRequest = await req.json();

    console.log(`Processing waiting list confirmation for: ${email}`);

    // Initialize Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if contact already exists
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // Add to contacts table if not exists (for future marketing campaigns)
    if (!existingContact) {
      const { error: contactError } = await supabase
        .from("contacts")
        .insert({
          name: name,
          email: email,
        });

      if (contactError) {
        console.error("Error adding to contacts:", contactError);
        // Don't fail the whole operation if contact insert fails
      } else {
        console.log(`Contact added successfully: ${email}`);
      }
    } else {
      console.log(`Contact already exists: ${email}`);
    }

    // Send confirmation email
    const firstName = name.split(" ")[0];
    
    const emailResponse = await resend.emails.send({
      from: "EMPODHERA <onboarding@resend.dev>",
      to: [email],
      subject: "Você está na lista de espera do EMPODHERA! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #1A1A1A;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%); border-radius: 16px; border: 1px solid #D4AF37;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <h1 style="color: #D4AF37; font-size: 32px; margin: 0; font-weight: normal; letter-spacing: 2px;">
                        EMPODHERA
                      </h1>
                      <p style="color: #B8860B; font-size: 14px; margin: 8px 0 0; letter-spacing: 1px;">
                        JANTAR EXCLUSIVO PARA MULHERES
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 20px 40px 40px;">
                      <h2 style="color: #FFFFFF; font-size: 24px; margin: 0 0 20px; font-weight: normal;">
                        Olá, ${firstName}! ✨
                      </h2>
                      
                      <p style="color: #E5E5E5; font-size: 16px; line-height: 1.8; margin: 0 0 20px;">
                        Que alegria ter você conosco! Você agora faz parte da <strong style="color: #D4AF37;">lista de espera exclusiva</strong> do EMPODHERA.
                      </p>
                      
                      <p style="color: #E5E5E5; font-size: 16px; line-height: 1.8; margin: 0 0 20px;">
                        Isso significa que você será uma das <strong style="color: #D4AF37;">primeiras a saber</strong> quando abrirmos as vagas para a próxima edição deste jantar transformador.
                      </p>
                      
                      <!-- Highlight Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td style="background-color: rgba(212, 175, 55, 0.1); border-left: 3px solid #D4AF37; padding: 20px; border-radius: 0 8px 8px 0;">
                            <p style="color: #D4AF37; font-size: 16px; margin: 0; font-style: italic;">
                              "A próxima edição está sendo preparada com muito carinho. Prepare-se para uma noite de conexões genuínas, conversas transformadoras e memórias inesquecíveis."
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #E5E5E5; font-size: 16px; line-height: 1.8; margin: 0 0 30px;">
                        Fique de olho no seu email — em breve você receberá novidades especiais!
                      </p>
                      
                      <!-- Signature -->
                      <p style="color: #B8860B; font-size: 16px; margin: 0;">
                        Com carinho,
                      </p>
                      <p style="color: #D4AF37; font-size: 18px; margin: 8px 0 0; font-weight: bold;">
                        Samira, Simone & Sueli
                      </p>
                      <p style="color: #888888; font-size: 14px; margin: 4px 0 0;">
                        Criadoras do EMPODHERA
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 30px; border-top: 1px solid #333;">
                      <p style="color: #666666; font-size: 12px; margin: 0; text-align: center;">
                        Este email foi enviado porque você se inscreveu na lista de espera do EMPODHERA.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Confirmation email sent and contact added",
        emailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-waiting-list-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
