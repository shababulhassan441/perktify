import React from "react";
import Coupon from "./Coupon";

const RedeemPoints = ({points,rewards}) => {
  return (
    <div className="flex  w-full ">
      <div className="custom-gradient2 flex-1 py-32  ">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <img
            src="/gift.webp"
            alt="coins"
            className=" w-[200px] object-cover"
          />

          <div className="text-center flex-1">
            <h2 className="text-2xl font-medium">Earned Points</h2>
            <h1 className="font-bold text-4xl">{points}</h1>
          </div>
        </div>
        <div>
          <p className="font-bold text-5xl text-black text-center capitalize  rounded-xl p-2 mt-2">
            Redeem Your <span className="text-storekwiltext"> points</span> to
            get Instant Reward
          </p>
        </div>
      </div>
      <div className="flex-1 p-8 flex flex-col gap-10">
        {
          rewards?.map(
            (coupon)=>(
              <Coupon
              key={coupon.$id}
              points={coupon.pointsRequired}
              discountText={coupon.name}
              couponCode={coupon.promoCode}
              buttonLabel="Copy Code"
              expiryDate={coupon.expiry}
            />
            )
          )
        }
       
      </div>
    </div>
  );
};

export default RedeemPoints;
