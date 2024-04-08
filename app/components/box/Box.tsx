import clsx from "clsx";

type BoxProps = { children: React.ReactNode; className?: string; border?: boolean };
export function Box({ children, className, border }: BoxProps) {
  return (
    <div
      className={clsx(
        {
          "rounded-md bg-white shadow-lg shadow-slate-200 transition dark:bg-slate-950 dark:shadow-slate-950/50":
            true,
          "border border-slate-100 dark:border-slate-800": border,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
