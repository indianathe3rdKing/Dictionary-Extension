"use client";

import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordInput(password) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="">
      <Label htmlFor={id}>Show/hide password input</Label>
        <Input
          id={id}
          className="pe-9"
          value={password}
          placeholder="Password"
          type={isVisible ? "text" : "password"}
        />
       
      </div>
    </div>
  );
}
