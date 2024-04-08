import { clearAuth } from "~/auth.server";

export const action = () => {
  return clearAuth("/");
};
