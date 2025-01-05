import CreateUserForm from "@/components/adminui/CreateUser";
import Breadcrumbs from "@/components/ui/Cases/Breadcrumbs";
import UpdatePassword from "@/components/user/password/UpdatePassword";
import ComplaintForm from "@/components/user/support/ComplaintForm";
import UserTickets from "@/components/user/support/UserTickets";
import { fetchUserDetails } from "@/lib/data";
import { cookies } from "next/headers";


export default async function Page() {
  cookies();
  const {queries,$id}=await fetchUserDetails()
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/user/overview" },
          {
            label: "Update Password",
            href: "/user/password/update",
            active: true,
          },
        ]}
      />
     {/* <ComplaintForm/> */}
     <UpdatePassword userId={$id}/>
    </main>
  );
}
