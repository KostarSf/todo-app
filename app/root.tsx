import { Account } from "@prisma/client";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { LoaderFunction } from "@vercel/remix";

import { clearAuth, getAuthFromRequest } from "./auth.server";
import accounts from "./models/accounts";
import "./tailwind.css";

export type RootLoaderData = null | { user: Account };

export const loader: LoaderFunction = async ({ request }): Promise<RootLoaderData> => {
  const userId = await getAuthFromRequest(request);
  if (!userId) {
    return null;
  }

  const user = await accounts.find(userId);
  if (!user) {
    throw clearAuth("/");
  }

  return { user };
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
      <body className="bg-slate-100">
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
