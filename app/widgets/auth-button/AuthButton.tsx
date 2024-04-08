import { useUser } from "~/utils/state-hooks";
import { LoginDialogButton } from "./LoginDialogButton";
import { UserDialogButton } from "./UserDialogButton";

export function AuthButton() {
  const user = useUser();
  return user ? <UserDialogButton user={user} /> : <LoginDialogButton />;
}
