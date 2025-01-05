import CaseProgress from "@/components/ui/Cases/CaseProgress";
import LevelMetrics from "@/components/user/account/LevelMetrics";
import LevelProgress from "@/components/user/account/LevelProgress";
import { fetchUserLevel } from "@/lib/data";
import { cookies } from "next/headers";

export default async function AccountPage() {
  cookies();
  const {points,level,labels,tiers}=await fetchUserLevel()
  
  return <>
<LevelProgress currentLevel={level} points={points} labels={labels} />
<LevelMetrics tiers={tiers}/>
  </>
  
}
