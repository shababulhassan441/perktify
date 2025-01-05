"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const GetReferURL = ({ code }) => {
  const [referCode, setReferCode] = useState(`${process.env.NEXT_PUBLIC_DOMAIN}/register?referCode=${code}`);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referCode)
      .then(() => {
        toast.success("Referral URL copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Error copying to clipboard");
      });
  };

  return (
    <div className="flex max-md:flex-col max-md:gap-4 items-center space-x-4 w-full max-w-screen-md">
      <input
        type="text"
        value={referCode}
        readOnly
        className="p-3 text-center  w-full border border-gray-300 rounded-md shadow-sm focus:outline-none font-medium text-gray-500 text-base tracking-wider"
        id="referURL"
      />
      <button
        onClick={copyToClipboard}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200 whitespace-nowrap"
      >
        Get Refer URL
      </button>
    </div>
  );
};

export default GetReferURL;
