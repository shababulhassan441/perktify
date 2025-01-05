"use client";
import Link from "next/link";
import React from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { BiSolidError } from "react-icons/bi";
import { createLoginSession } from "@/lib/actions";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

const Login = () => {
  const [state, formAction] = useFormState(createLoginSession, initialState);
  return (
    <div className="mx-4 md:max-w-[400px] w-full self-center justify-self-center bg-white/[0.34] backdrop-blur-md rounded-lg shadow-[0_0_30px_0_rgba(0,0,0,0.05)] ">
      <div className="p-6">
        <div className="">
          <h2 className="text-center font-semibold text-2xl mb-2">
            Sign in to your account
          </h2>
  
          {state?.message && (
            <p className="flex items-center gap-4 text-red-600 border-l-4 px-2 shadow-md border-l-red-600 bg-red-100 w-fit mx-auto py-1 mt-1 text-sm">
              <BiSolidError className="text-2xl" />
              {state?.message}
            </p>
          )}
        </div>
        <form action={formAction}>
          <Input
            label="email"
            type="email"
            name="email"
            placeholder="Enter Email"
          />
          <Input
            label="Password"
            placeholder="Enter Your Password"
            type="password"
            name="password"
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
            className="flex gap-2 items-center justify-center  bg-gradient-to-r from-primary to-secondary mt-4 w-full hover:to-primary hover:from-secondary duration-500 ease-in-out"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
