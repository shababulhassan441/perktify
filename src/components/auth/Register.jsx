"use client";

import Link from "next/link";
import React from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { BiSolidError } from "react-icons/bi";
import { createSellerAccount } from "@/lib/actions";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

const Register = () => {
  const [state, formAction] = useFormState(createSellerAccount, initialState);

  return (
    <div className="mx-4 md:max-w-[400px] w-full self-center justify-self-center bg-white backdrop-blur-md rounded-lg shadow-[0_0_30px_0_rgba(0,0,0,0.05)] border">
      <div className="p-6">
        <div className="">
          <h2 className="text-center font-semibold text-2xl mb-2">
            Register to create account
          </h2>
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link href={"/"} className="font-bold hover:underline">
              Sign In
            </Link>
          </p>
          {state?.message && (
            <p className="flex items-center gap-4 text-red-600 border-l-4 px-2 shadow-md border-l-red-600 bg-red-100 w-fit mx-auto py-1 mt-1 text-sm">
              <BiSolidError className="text-2xl" />
              {state?.message}
            </p>
          )}
        </div>
        <form action={formAction}>
          <Input
            label="Name"
            type="text"
            name="name"
            placeholder="Enter your name"
            required
          />
          <Input
            label="email"
            type="email"
            name="email"
            placeholder="Enter Email"
            required
          />
          <Input
            label="Password"
            placeholder="Enter Your Password"
            type="password"
            name="password"
            required
          />

          {/* <div className="flex items-center justify-start gap-4 mt-2 ">
            {" "}
            <input
              type="checkbox"
              checked={showPassword}
              id="showpwd"
              onChange={handleShowPwd}
            />
            <label htmlFor="showpwd">Show Characters</label>
          </div> */}

          <Button
            type="submit"
            className="flex gap-2 items-center justify-center bg-storekwiltext mt-4 w-full"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
