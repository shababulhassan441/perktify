import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionClient } from "../appwrite/config";

const auth = {
  user: null,
  sessionCookie: null,
  getUser: async () => {
    auth.sessionCookie = cookies().get("session");

    try {
      const { account } = await createSessionClient(auth.sessionCookie.value);
      auth.user = await account.get();
    } catch (error) {
      if (error.type === `user_more_factors_required`) {
        // redirect to perform MFA
        const { account } = await createSessionClient(auth.sessionCookie.value);
        const challenge = await account.createMfaChallenge(
          "email" // factor
        );
        redirect(`/verify/${challenge.$id}`);
      } else {
        // handle other errors
        auth.user = null;
        auth.sessionCookie = null;
      }
    }
    return auth.user;
  },
  deleteSession: async () => {
    "use server";
    auth.sessionCookie = cookies().get("session");
    try {
      const { account } = await createSessionClient(auth.sessionCookie.value);
      await account.deleteSession("current");
    } catch (error) {}

    cookies().delete("session");
    auth.user = null;
    auth.sessionCookie = null;
    redirect("/login");
  },
};

export default auth;
