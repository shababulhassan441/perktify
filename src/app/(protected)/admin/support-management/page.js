import CouponRewardsList from "@/components/admin/CouponRewardsList";
import LevelTierList from "@/components/admin/LevelTierList";
import LevelTierContainer from "@/components/admin/LevelTierList";
import TicketView from "@/components/admin/TicketView";
import UsersTable from "@/components/admin/UsersTable";
import { fetchAllQueries } from "@/lib/data";
import { cookies } from "next/headers";

export default async function TiersManagementPage() {
  cookies();

  const tickets=await fetchAllQueries()
      
  return (
    <>

      <TicketView tickets={tickets} />;
    </>
  );
}
