import React from "react";
import auth from "@/lib/auth";
import SideNav from "@/components/ui/sidebar/SideNav";


export default async function ProtectedLayout({ children }) {
  const user = await auth.getUser();

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className=" relative flex-grow bg-surface md:overflow-y-auto">
          <div className="sticky top-0 w-full z-50 flex items-center justify-between bg-white shadow-md p-6 md:px-12 mb-4 ">
            <div className={` `}>
              <h1 className="text-3xl font-bold montserrat capitalize">
                Hello, {user?.name} !
              </h1>

              <p className="text-base font-normal text-nav-inactive montserrat">
                Manage & Track your activities with pleasure
              </p>
            </div>
            <div className="flex  items-center gap-4">
              <div className="flex flex-col items-end justify-startfont-medium dark:text-white">
                <div className="px-3 p-1 4  text-sm text-blue-600 rounded-lg bg-sky-100  capitalize">
                  {user?.labels?.[0]}
                </div>
                <div className="4  text-sm text-gray-600 rounded-lg lowercase">
                  {user?.email}
                </div>
              </div>
              <div
                className="relative p-1 border border-gray-300 rounded-full cursor-pointer"
                // onClick={() => setDropdown(!dropdown)}
              >
                <div className="w-10 h-10 rounded-full bg-black text-white font-semibold text-3xl flex items-center justify-center uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <span className="bottom-2 left-9 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                {/* Dropdown menu */}
                {/* {dropdown && (
                  <div
                    id="userDropdown"
                    className="z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                    onMouseLeave={() => setDropdown(false)}
                  >
                    <div className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                      <div className="font-bold"> {user?.firstName}</div>
                      <div className="font-medium text-gray-500 truncate">
                        {user?.email}
                      </div>
                    </div>
                    <LogoutBtn avatar />
                  </div>
                )} */}
              </div>
            </div>
          </div>
          <div className="  flex-grow p-6 pt-4 md:overflow-y-auto md:p-12 md:pt-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
