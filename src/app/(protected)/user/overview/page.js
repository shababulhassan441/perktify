import { Suspense } from "react";
import {  CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/components/ui/skeletons";
import {  HRCardData, UserCardData } from "@/components/adminui/DashboardCards";
import RevenueChart from "@/components/user/dashboard/RevenueChart";
import LatestRegistrations from "@/components/user/dashboard/LatestRegistrations";
// import RevenueChart from "@/components/admin/RevenueChart";



export const metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  return (
    <main>
      <h1 className={` mb-4 text-xl md:text-xl`}>Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <UserCardData/>
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
