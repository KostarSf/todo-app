import { Account } from "@prisma/client";

import { LoginDialogButton } from "./LoginDialogButton";
import { UserDialogButton } from "./UserDialogButton";

export function AuthButton({ user }: { user?: Account }) {
  return user ? <UserDialogButton user={user} /> : <LoginDialogButton />;
}
