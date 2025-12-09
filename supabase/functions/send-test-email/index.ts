import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendTestEmailRequest {
  campaignId: string;
  testEmail: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { campaignId, testEmail }: SendTestEmailRequest = await req.json();
    
    if (!campaignId) throw new Error("campaignId is required");
    if (!testEmail) throw new Error("testEmail is required");

    console.log(`Sending test email for campaign ${campaignId} to ${testEmail}`);

    // Fetch campaign
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error("Campaign not found");
    }

    // Replace {{nome}} with test name
    const personalizedHtml = campaign.html_content.replace(/\{\{nome\}\}/g, "Teste");

    // Send test email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EMPODHERA <contato@empodhera.com>",
        to: [testEmail],
        subject: `[TESTE] ${campaign.subject}`,
        html: personalizedHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend error:", errorText);
      throw new Error(`Failed to send test email: ${errorText}`);
    }

    const result = await res.json();
    console.log("Test email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, message: `Test email sent to ${testEmail}` }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error sending test email:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
