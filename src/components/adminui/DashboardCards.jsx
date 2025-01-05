import { fetchCardDataCases, fetchAdminCardData, fetchUserCardData, fetchUserInsights } from "@/lib/data";
import { SiGraphql } from "react-icons/si";
import { TbChartInfographic } from "react-icons/tb";
import { MdOutlineCalendarMonth } from "react-icons/md";


import { FaCoins } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { IoCashOutline } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";

import { LuClipboardCheck } from "react-icons/lu";
import { LuClipboardEdit } from "react-icons/lu";
import { HiMiniHandThumbUp, HiMiniHandThumbDown } from "react-icons/hi2";
import { MdOutlineSummarize } from "react-icons/md";
import {
  UserGroupIcon,
  CheckIcon,
  ClockIcon,
  XCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { cookies } from "next/headers";

// const iconMap = {
//   staffs: UserGroupIcon,
//   lawyers: UserGroupIcon,
//   victims: UserGroupIcon,
//   perpetrators: UserGroupIcon,
//   pending: UserGroupIcon,
//   review: UserGroupIcon,
//   assigned: UserGroupIcon,
//   approved: UserGroupIcon,
//   declined: UserGroupIcon,
//   won: UserGroupIcon,
//   lost: UserGroupIcon,
// };

const iconMap = {
  // Role-based icons
  users: UserGroupIcon, // Group icon for staff members
  direct: TbChartInfographic, // Individual user icon for lawyers
  reffered: SiGraphql, // Removed user icon representing victims
  monthly: MdOutlineCalendarMonth, // General user icon for perpetrators
  points:FaCoins,
  available:FaHandHoldingDollar,
  used:IoCashOutline,
  leads:MdLeaderboard,
};

const HRCardData = async () => {
  cookies();
  const { users, direct, referred, monthly } = await fetchAdminCardData();

  return (
    <>
      <Card title="Earned Points" value={users} type="staffs" />
      <Card title="Members Enrolled" value={direct} type="lawyers" />
      <Card title="Available Balance" value={referred} type="victims" />
      <Card title="Used Balance" value={monthly} type="perpetrators" />
    </>
  );
};
const AdminCardData = async () => {
  cookies();
  const { users, direct, referred, monthly } = await fetchAdminCardData();

  return (
    <>
      <Card title="Total Registrations" value={users} type="users" />
      <Card title="Direct Leads" value={direct} type="direct" />
      <Card title="Referral Leads" value={referred} type="reffered" />
      <Card title="This Month Leads" value={monthly} type="monthly" />
    </>
  );
};
const UserCardData = async () => {
  cookies();
  const { points, leads, available, used } = await fetchUserCardData();

  return (
    <>
     <Card title="Earned Points" value={points} type="points" />
      <Card title="Members Enrolled" value={leads} type="leads" />
      <Card title="Available Balance" value={available} type="available" />
      <Card title="Used Balance" value={used} type="used" />
    </>
  );
};

const UserInsights= async ({userId}) => {
  cookies();
  const { points, leads, available, used } = await fetchUserInsights(userId);

  return (
    <>
     <Card title="Earned Points" value={points} type="points" />
      <Card title="Members Enrolled" value={leads} type="leads" />
      <Card title="Available Balance" value={available} type="available" />
      <Card title="Used Balance" value={used} type="used" />
    </>
  );
};
const CasesCardData = async () => {
  cookies();
  const { pending, review, assigned, approved, declined, won, lost } =
    await fetchCardDataCases();

  const totalCases =
    pending + review + assigned + approved + declined + won + lost;
  return (
    <>
      <Card title="Total" value={totalCases} type="total" />
      <Card title="Pending" value={pending} type="pending" />
      <Card title="Review" value={review} type="review" />
      <Card title="Assigned" value={assigned} type="assigned" />
      <Card title="Approved" value={approved} type="approved" />
      <Card title="Declined" value={declined} type="declined" />
      <Card title="Won" value={won} type="won" />
      <Card title="Lost" value={lost} type="lost" />
    </>
  );
};

export function Card({ title, value, type }) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-light p-4 shadow-sm text-gray-500 border">
      <div className="flex ">{Icon ? <Icon className="h-6 w-6 " /> : null}</div>
      <p
        className={`truncate rounded-xl  font-medium  text-start py-1 pt-6  text-gray-900 text-3xl`}
      >
        {value}
      </p>
      <h3 className=" text-lg ">{title}</h3>
    </div>
  );
}

export { HRCardData, CasesCardData, AdminCardData,UserCardData,UserInsights };
