import { forwardRef } from "react";

type TextInputProps = { type: "text" | "password" | "email"; error?: string } & Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "className"
>;
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          {...props}
          className="w-full rounded-md border border-slate-100 bg-transparent px-4 py-2 text-lg text-slate-800 outline-none ring-indigo-400 transition placeholder:text-slate-400 placeholder:transition hover:border-indigo-300 focus:border-indigo-400 focus:ring focus:placeholder:text-slate-300 focus:hover:border-indigo-400"
        />
        {error && <p className="px-4 py-2 text-sm text-rose-500">{error}</p>}
      </div>
    );
  },
);
TextInput.displayName = "TextInput";
