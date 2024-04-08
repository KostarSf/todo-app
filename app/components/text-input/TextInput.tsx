import clsx from "clsx";
import { forwardRef } from "react";

type TextInputProps = {
  type: "text" | "password" | "email";
  error?: string;
  loading?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"input">, "type" | "className">;
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, loading, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          className="w-full rounded-md border border-slate-200 bg-transparent px-4 py-2 text-lg text-slate-800 outline-none ring-indigo-400 transition placeholder:text-slate-400 placeholder:transition hover:border-indigo-300 focus:border-indigo-400 focus:ring focus:placeholder:text-slate-300 focus:hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-50 dark:ring-indigo-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600 dark:focus:hover:border-indigo-600"
        />
        {error && <p className="px-4 py-2 text-sm text-rose-500">{error}</p>}

        <div
          className={clsx({
            "pointer-events-none absolute right-0 top-0 px-3 py-3 transition": true,
            "scale-100 opacity-100 delay-200": loading,
            "scale-50 opacity-0": !loading,
          })}
        >
          <span className="spinner h-6 w-6 animate-spin"></span>
        </div>
      </div>
    );
  },
);
TextInput.displayName = "TextInput";
