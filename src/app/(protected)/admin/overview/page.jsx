import { Suspense } from "react";
import {  CardsSkeleton, CasesCardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/components/ui/skeletons";
import { AdminCardData, CasesCardData, HRCardData } from "@/components/adminui/DashboardCards";
import RevenueChart from "@/components/admin/RevenueChart";
import LatestRegistrations from "@/components/admin/LatestRegistrations";




export const metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  return (
    <main>
      <h1 className={` mb-4 text-xl md:text-xl`}>Users Overview</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <AdminCardData/>
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}> <LatestRegistrations/></Suspense>
       
      </div>
    </main>
  );
}
