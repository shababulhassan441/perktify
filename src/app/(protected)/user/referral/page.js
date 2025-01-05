import LevelProgress from "@/components/user/account/LevelProgress";
import GetReferCode from "@/components/user/referral/GetReferCode";
import GetReferURL from "@/components/user/referral/GetReferURL";
import { fetchUserLevel } from "@/lib/data";
import { cookies } from "next/headers";

export default async function AccountPage({searchParams}) {
  cookies();
  const {referCode}=searchParams;
  const { points, level, labels, code } = await fetchUserLevel();
  return (
    <div className="bg-white border rounded-xl flex max-md:flex-col">
      <div className="flex-1 p-6">
        <LevelProgress currentLevel={level} points={points} labels={labels} />
        <div className="flex gap-8  border p-8 rounded-xl">
          <img
            src="/gift.webp"
            alt="coins"
            className=" w-[120px] object-cover border rounded-xl p-2"
          />
          <div className="text-xl">
            <h1 className="font-bold  text-gray-700">Get upto Next Level</h1>
            <p className="font-normal text-gray-500">
              Increase your chances to be the first to gain exclusive access to
              Storekwil.
            </p>
          </div>
        </div>
        <p className="font-bold text-5xl text-black text-center capitalize border rounded-xl p-2 mt-2 mb-4">
          Earn upto <span className="text-yellow-500">100 points</span> for each
          referral
        </p>
        <GetReferURL code={code} />
      </div>
      <GetReferCode code={code} referCodetest={referCode}/>
    </div>
  );
}
