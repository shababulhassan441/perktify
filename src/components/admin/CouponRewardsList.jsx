"use client";
import { useState } from "react";
import PopupForm from "./PopupForm";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import Empty from "../ui/Empty";
import { formatDateToLocal } from "@/lib/utils";
import { createRewardCoupon, deleteReward } from "@/lib/actions";
import Button from "../common/Button";
import { TrashIcon } from "@heroicons/react/24/outline";

function DeleteReward({ fileID }) {
  return (
    <form action={deleteReward} className="mt-4">
      <input type="hidden" value={fileID} name="fileID" />
      <Button
        type="submit"
        className="rounded-md border h-10 bg-gray-50  hover:bg-gray-100 flex items-center justify-center"
      >
        <TrashIcon className="w-5 text-gray-600" />
      </Button>
    </form>
  );
}

const CouponRewardsList = ({ coupons = [] }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="p-6 bg-white rounded-xl border ">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Coupons & Rewards
      </h2>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 bg-gray-50 border text-gray-600 rounded-md hover:bg-gray-100"
        >
          Create New Coupon/Reward
        </button>
      </div>

      {coupons.length === 0 ? (
        <section className="mb-4 mt-6 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out bg-light">
          <div className="flex items-center justify-center">
            <Empty />
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl bg-gray-50 duration-200 ease-in-out"
            >
              <h3 className="text-md font-semibold text-gray-700">
                {coupon.name}
              </h3>
              <p className="text-sm text-gray-500">
                Promo Code: {coupon.promoCode}
              </p>
              <p className="text-sm text-gray-500">
                Reward Type: {coupon.rewardType}
              </p>
              <p className="text-sm text-gray-500">
                Points Required: {coupon.pointsRequired}
              </p>
              <p className="text-sm text-gray-500">
                Expiry Date: {formatDateToLocal(coupon.expiry)}
              </p>

              <DeleteReward fileID={coupon.$id} />
            </div>
          ))}
        </div>
      )}

      {isPopupOpen && (
        <PopupForm
          title="Create New Coupon/Reward"
          fields={[
            { fieldname: "title", placeholder: "Coupon Name", type: "text" },
            {
              fieldname: "promoCode",
              placeholder: "Coupon Promo Code",
              type: "text",
            },
            {
              fieldname: "pointsRequired",
              placeholder: "Points Required",
              type: "number",
            },
            {
              fieldname: "expiry",
              placeholder: "Expiry Date",
              type: "date",
            },
          ]}
          selectInputs={[
            {
              placeholder: "Select Reward Type",
              fieldname: "rewardType",
              options: ["CASH", "VOUCHER", "COUPON", "BADGE"],
            },
          ]}
          onSubmit={createRewardCoupon}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default CouponRewardsList;
