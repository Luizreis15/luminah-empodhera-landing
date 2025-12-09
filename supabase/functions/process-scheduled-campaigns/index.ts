import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Checking for scheduled campaigns...");

    // Find campaigns that are scheduled and ready to be sent
    const now = new Date().toISOString();
    const { data: scheduledCampaigns, error: fetchError } = await supabase
      .from("campaigns")
      .select("id, title, scheduled_at")
      .eq("status", "scheduled")
      .lte("scheduled_at", now);

    if (fetchError) {
      console.error("Error fetching scheduled campaigns:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${scheduledCampaigns?.length || 0} campaigns to process`);

    if (!scheduledCampaigns || scheduledCampaigns.length === 0) {
      return new Response(
        JSON.stringify({ message: "No campaigns to process", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = [];

    for (const campaign of scheduledCampaigns) {
      console.log(`Processing campaign: ${campaign.title} (${campaign.id})`);

      try {
        // Call the send-campaign function
        const { error: invokeError } = await supabase.functions.invoke("send-campaign", {
          body: { campaignId: campaign.id },
        });

        if (invokeError) {
          console.error(`Error sending campaign ${campaign.id}:`, invokeError);
          results.push({ id: campaign.id, status: "error", error: invokeError.message });
        } else {
          console.log(`Campaign ${campaign.id} sent successfully`);
          results.push({ id: campaign.id, status: "sent" });
        }
      } catch (error) {
        console.error(`Exception processing campaign ${campaign.id}:`, error);
        results.push({ id: campaign.id, status: "error", error: String(error) });
      }
    }

    console.log("Processing complete:", results);

    return new Response(
      JSON.stringify({ 
        message: "Campaigns processed", 
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in process-scheduled-campaigns:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
