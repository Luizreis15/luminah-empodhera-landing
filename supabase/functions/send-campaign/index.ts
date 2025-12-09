import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendCampaignRequest {
  campaignId: string;
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

    const { campaignId }: SendCampaignRequest = await req.json();
    if (!campaignId) throw new Error("campaignId is required");

    console.log(`Starting campaign send for: ${campaignId}`);

    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns").select("*").eq("id", campaignId).single();
    if (campaignError || !campaign) throw new Error("Campaign not found");

    const { data: contacts, error: contactsError } = await supabase
      .from("contacts").select("id, email, name");
    if (contactsError || !contacts?.length) throw new Error("No contacts to send to");

    console.log(`Sending to ${contacts.length} contacts`);

    await supabase.from("campaigns").update({ status: "sending" }).eq("id", campaignId);

    let successCount = 0, failCount = 0;

    for (const contact of contacts) {
      try {
        const personalizedHtml = campaign.html_content.replace(/\{\{nome\}\}/g, contact.name || "");

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "EMPODHERA <contato@empodhera.com>",
            to: [contact.email],
            subject: campaign.subject,
            html: personalizedHtml,
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        await supabase.from("email_logs").insert({
          campaign_id: campaignId, contact_id: contact.id, status: "sent", sent_at: new Date().toISOString(),
        });
        successCount++;
        console.log(`Sent to ${contact.email}`);
      } catch (emailError) {
        await supabase.from("email_logs").insert({
          campaign_id: campaignId, contact_id: contact.id, status: "failed",
          error_message: emailError instanceof Error ? emailError.message : "Unknown error",
        });
        failCount++;
        console.error(`Failed to send to ${contact.email}:`, emailError);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await supabase.from("campaigns").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", campaignId);

    return new Response(JSON.stringify({ success: true, sent: successCount, failed: failCount }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
