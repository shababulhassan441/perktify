"use client";

import Input from "@/components/common/Input";
import { UpdateUserPassword } from "@/lib/actions";
import { useState, useRef, useEffect } from "react";

import { BiSolidCheckCircle, BiSolidError, BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import Button from "@/components/common/Button";

const initialState = {
  message: "",
  type: "",
};

export default function UpdatePassword({userId}) {
  const [state, formAction] = useFormState(UpdateUserPassword, initialState);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });


  const formRef = useRef(null); // Reference to the form element

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      formRef.current.reset(); // Resets the form fields
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);


  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form
      ref={formRef}
      className="bg-white border p-4 rounded-lg"
      action={formAction}
      autoComplete="off"
    >

      <div className="relative mb-4">
        <Input
          label="New Password"
          name="newpwd"
          type={showPassword.newPassword ? "text" : "password"}
          placeholder="Enter New Password"
          required
        />
        <div
          className="absolute top-[60%] text-2xl right-3 flex items-center cursor-pointer"
          onClick={() => togglePasswordVisibility("newPassword")}
        >
          {showPassword.newPassword ? <BiHide /> : <BiShow />}
        </div>
      </div>

      <div className="relative mb-4">
        <Input
          label="Confirm New Password"
          name="confirmpwd"
          type={showPassword.confirmPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          required
        />
        <div
          className="absolute top-[60%] text-2xl right-3 flex items-center cursor-pointer"
          onClick={() => togglePasswordVisibility("confirmPassword")}
        >
          {showPassword.confirmPassword ? <BiHide /> : <BiShow />}
        </div>
      </div>

      <input type="hidden" name="userId" value={userId} />

      <div className="mt-6 flex justify-end gap-4">
        <Button
          type="submit"
          className="flex gap-2 items-center justify-center bg-gray-50 border !text-gray-500 hover:bg-gray-100  !w-fit"
        >
          Update Password
        </Button>
      </div>


    </form>
  );
}
