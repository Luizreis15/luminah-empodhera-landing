import { FinanceLayout } from "@/components/finance/FinanceLayout";
import { SponsorsTable } from "@/components/finance/SponsorsTable";
import { SponsorForm } from "@/components/finance/SponsorForm";

export default function FinanceSponsors() {
  return (
    <FinanceLayout title="Patrocinadores">
      <div className="space-y-6">
        <div className="flex justify-end">
          <SponsorForm />
        </div>
        <SponsorsTable />
      </div>
    </FinanceLayout>
  );
}
