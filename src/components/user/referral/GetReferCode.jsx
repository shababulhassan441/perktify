"use client"
import { useState } from "react";
import { toast } from "react-toastify";

const GetReferCode = ({code,referCodetest}) => {
  const [referCode, setReferCode] = useState(code);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referCode).then(() => {
      toast.success("Referral code copied to clipboard!");
    }).catch(err => {
      toast.error("Error copying to clipboard");
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Banner Image */}
      <div className="mb-6 h-full">
        <img 
          src="/refer.webp" 
          alt="Referral Banner" 
          className="w-full max-w-screen-md h-auto object-contain"
        />
      </div>

      {/* Referral Code Section */}
      <div className="flex max-md:flex-col max-md:gap-4 items-center space-x-4 w-full max-w-screen-md">
        <input 
          type="text" 
          value={referCode} 
          readOnly 
          className="p-3 text-center  w-full text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none font-bold tracking-wider"
          id="referCode"
        />
        <button 
          onClick={copyToClipboard} 
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200 whitespace-nowrap"
        >
          Get Refer Code
        </button>
      </div>
    </div>
  );
};

export default GetReferCode;
