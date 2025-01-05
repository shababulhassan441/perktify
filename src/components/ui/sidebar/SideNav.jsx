import Link from "next/link";
import LogoutBtn from "./LogoutBtn";
import NavLinks from "./NavLinks";
import auth from "@/lib/auth";
export default async function SideNav() {
  const user = await auth.getUser();
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-storekwiltext">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md custom-gradient backdrop-blur-2xl  md:p-4 md:h-40"
        href="/"
      >
        <img
          src="/logo.png"
          alt="Parkheld-logo"
          className=" w-[120px] md:w-[240px] object-cover"
        />
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks user={user} />
        <div className="hidden h-auto w-full grow rounded-md  md:block"></div>
        <LogoutBtn />
      </div>
    </div>
  );
}
