import { useFetcher } from "@remix-run/react";
import { useId, useState } from "react";

import { Button, Dialog, TextInput } from "~/components";

export function LoginDialogButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [window, setWindow] = useState<"login" | "register">("login");

  const formId = useId();
  const fetcher = useFetcher();

  function closeModal() {
    setIsOpen(false);
    setWindow("login");
  }

  function openModal() {
    setIsOpen(true);
  }

  function switchWindows() {
    setWindow(window === "login" ? "register" : "login");
  }

  return (
    <>
      <Button variant="highlight" size="small" onClick={openModal}>
        Авторизация
      </Button>

      <Dialog
        show={isOpen}
        onClose={closeModal}
        title={window === "login" ? "Вход" : "Регистрация"}
      >
        <fetcher.Form className="mt-4 space-y-2" id={formId} method="POST">
          <TextInput type="email" placeholder="Email" name="email" required />
          <TextInput type="password" placeholder="Пароль" name="password" required />
          {window === "register" && (
            <TextInput
              type="password"
              placeholder="Повторите пароль"
              name="retype-password"
              required
            />
          )}
        </fetcher.Form>

        <div className="mt-6 space-y-2">
          <Button type="submit" fullWidth form={formId}>
            {window === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>
          <Button fullWidth variant="secondary" size="small" onClick={switchWindows}>
            {window === "login" ? "Регистрация" : "Вход"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
