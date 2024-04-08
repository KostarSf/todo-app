import { Account } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { RootLoaderData } from "~/root";

export function useUser(): Account | null {
  const rootData = useMatches()[0].data as RootLoaderData;

  if (!rootData || typeof rootData !== "object") {
    return null;
  }

  if ("user" in rootData && !!rootData.user && typeof rootData.user === "object") {
    return rootData.user as Account;
  }

  return null;
}
