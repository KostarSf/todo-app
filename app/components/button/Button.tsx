import clsx from "clsx";
import { forwardRef } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "highlight";
  size?: "normal" | "small";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"button">, "className">;
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "normal",
      fullWidth,
      children,
      type,
      loading,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type || "button"}
        className={clsx({
          "flex items-center justify-center gap-2 rounded-md border border-transparent font-semibold text-indigo-400 ring-indigo-400 transition hover:text-indigo-500 focus:outline-none focus-visible:ring dark:text-indigo-400 dark:ring-indigo-600 dark:hover:text-indigo-300":
            true,
          "w-full": fullWidth,
          "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900":
            variant === "primary",
          "hover:bg-indigo-100 dark:hover:bg-indigo-950": variant === "highlight",
          "px-4 py-2": size === "normal",
          "px-3 py-1 text-sm": size === "small",
        })}
        disabled={disabled || loading}
      >
        {children}
        {loading && <span className="spinner h-4 w-4 animate-spin border-2"></span>}
      </button>
    );
  },
);
Button.displayName = "Button";
