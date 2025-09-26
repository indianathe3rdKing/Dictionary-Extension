"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { userApi } from "@/lib/api";
import SubmitAlert from "../components/submit-alert";
import { Link } from "react-router-dom";
import login from "./login";

export const UserForm = () => {};

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    surname: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormData({ name: "", surname: "", email: "", password: "" });
      const response = await userApi.createUser(formData);
      console.log("Form submitted:", formData);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      // Clear form only after successful submission
      setFormData({ name: "", surname: "", email: "", password: "" });
      // Set the message for the alert
      console.log("Signup response message:", response.data.body);
      const parsed = JSON.parse(response.data.body);

      message = parsed.message;
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };
  return (
    <div className="shadow-input relative mx-auto w-[80%] max-w-md overflow-y-hidden rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      {showAlert && <SubmitAlert message={message} />}
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Create your account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Log in if you don&apos;t have an account yet.
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 ">
          <LabelInputContainer>
            <Label htmlFor="name">Firstname</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Durden"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="surname"> Surname</Label>
            <Input
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Durden"
              type="text"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="projectmayhem@fc.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>
        {/* <LabelInputContainer className="mb-8">
          <Label htmlFor="twitterpassword">Your twitter password</Label>
          <Input
            id="twitterpassword"
            placeholder="••••••••"
            type="twitterpassword"
          />
        </LabelInputContainer> */}

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <p>
            If you already have an account,{" "}
            <Link className="text-blue-500 hover:underline" to="./login">
              Login
            </Link>
          </p>
          {/* <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button> */}
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
