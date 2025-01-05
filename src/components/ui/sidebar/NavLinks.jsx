"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxDashboard } from "react-icons/rx";
import { FaUsersCog } from "react-icons/fa";
import { TbUserPentagon } from "react-icons/tb";
import { BsGift } from "react-icons/bs";
import { MdSupportAgent } from "react-icons/md";
import { GrAchievement } from "react-icons/gr";
import { MdOutlineAutoGraph } from "react-icons/md";
import { TbPentagonNumber0 } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { MdContactSupport } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiMarketo } from "react-icons/si";
import { MdOutlinePostAdd } from "react-icons/md";
import { BsListColumnsReverse } from "react-icons/bs";
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "Overview",
    href: "overview",
    icon: RxDashboard,
    allow: ["admin", "user"],
  },
  {
    name: "User Management",
    href: "users-management",
    icon: FaUsersCog,
    allow: ["admin"],
  },
  {
    name: "Storekwil Waitlist",
    href: "waitlist/storekwil",
    icon: BsListColumnsReverse,
    allow: ["admin"],
  },
  {
    name: "Tier Management",
    href: "tiers-management",
    icon: TbPentagonNumber0,
    allow: ["admin"],
  },
  {
    name: "Compaigns Management",
    href: "compaigns-management",
    icon: MdOutlinePostAdd,
    allow: ["admin"],
  },
  {
    name: "Rewards Management",
    href: "rewards-management",
    icon: GrAchievement,
    allow: ["admin"],
  },
  {
    name: "Marketing Material",
    href: "marketing-material",
    icon: SiMarketo,
    allow: ["admin"],
  },
  {
    name: "Transaction History",
    href: "transaction-history",
    icon: GrTransaction,
    allow: ["admin"],
  },
  {
    name: "Support Management",
    href: "support-management",
    icon: MdContactSupport,
    allow: ["admin"],
  },

  // User
  {
    name: "My Account",
    href: "account",
    icon: TbUserPentagon,
    allow: ["user"],
  },
  {
    name: "Refer A Friend",
    href: "referral",
    icon: MdOutlineAutoGraph,
    allow: ["user"],
  },
  {
    name: "Rewards",
    href: "rewards",
    icon: BsGift,
    allow: ["user"],
  },
  {
    name: "Customer Support",
    href: "support",
    icon: MdSupportAgent,
    allow: ["user"],
  },
  {
    name: "Update Password",
    href: "password/update",
    icon: RiLockPasswordLine,
    allow: ["user","admin"],
  },




];

export default function NavLinks({ user }) {
  const pathname = usePathname();
  return (
    <>
      {links
        .filter((link) => link.allow.includes(user?.labels?.[0]))
        .map((link) => {
          const LinkIcon = link.icon;

          return (
            <Link
              key={link.name}
              href={`/${user?.labels?.[0]}/${link.href}`}
              className={clsx(
                "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-storekwiltext text-white p-3 text-sm font-medium hover:bg-white/[0.34] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-white/[0.34]":
                    pathname === `/${user?.labels?.[0]}/${link.href}`,
                }
              )}
            >
              <LinkIcon className="text-[24px]" />
              <p className="hidden md:block font-navlinks">{link.name}</p>
            </Link>
          );
        })}
    </>
  );
}
