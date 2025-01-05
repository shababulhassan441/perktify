import CompaignsView from "@/components/admin/CompaignsView";
import CouponRewardsList from "@/components/admin/CouponRewardsList";
import LevelTierList from "@/components/admin/LevelTierList";
import LevelTierContainer from "@/components/admin/LevelTierList";
import TicketView from "@/components/admin/TicketView";
import UsersTable from "@/components/admin/UsersTable";
import { fetchAllCompaigns, fetchAllQueries } from "@/lib/data";
import { cookies } from "next/headers";

export default async function CompaignsManagementPage() {
  cookies();

  const Compaigns = await fetchAllCompaigns();

  return (
    <>
      <CompaignsView Compaigns={Compaigns} />;
    </>
  );
}
