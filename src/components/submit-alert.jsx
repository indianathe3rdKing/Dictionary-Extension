import { CircleCheckIcon } from "lucide-react";

export default function SubmitAle({ message }) {
  return (
    <div className="border-eborder rounded-md border px-4 py-3 absolute z-index-100 w-2xs top-4 left-[-20%]  transform translate-x-1/2 bg-white shadow-md">
      <p className="text-sm ">
        <CircleCheckIcon
          className="me-3 -mt-0.5 inline-flex text-emerald-500 "
          size={16}
          aria-hidden="true"
        />
        {message}
      </p>
    </div>
  );
}
