import Button from "@/components/common/Button";
import auth from "@/lib/auth";
import { MdExitToApp } from "react-icons/md";

const LogoutBtn = ({ avatar = false }) => {
  return (
    <>
      {!avatar ? (
        <form
          action={auth.deleteSession}
        >
          <Button type="submit"  className={`flex h-[48px] bg-transparent  items-center  gap-2 rounded-md  text-gray-400 p-3 text-sm font-medium hover:bg-white/[0.34]  md:flex-none md:justify-start md:p-2 md:px-3 `}>
            <MdExitToApp className="text-[24px]" />
            Sign Out
          </Button>
        </form>
      ) : (
        <form action={auth.deleteSession} className="py-1">
          <button
            type="submit"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Sign out
          </button>
        </form>
      )}
    </>
  );
};



export default LogoutBtn;
