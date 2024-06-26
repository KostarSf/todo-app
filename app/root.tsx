import { Account } from "@prisma/client";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { LoaderFunction } from "@vercel/remix";

import { getOptionalUser } from "./auth.server";
import "./tailwind.css";

export type RootLoaderData = { user: Account | null };

export const loader: LoaderFunction = async ({ request }): Promise<RootLoaderData> => {
  return { user: await getOptionalUser(request) };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 antialiased transition dark:bg-slate-900">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
