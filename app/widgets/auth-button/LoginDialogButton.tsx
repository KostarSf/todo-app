import { useFetcher } from "@remix-run/react";
import { useEffect, useId, useState } from "react";

import { Button, Dialog, TextInput } from "~/components";
import { RegisterActionData } from "~/routes/api.register";

type Window = "login" | "register";

export function LoginDialogButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [window, setWindow] = useState<Window>("login");

  function closeModal() {
    setIsOpen(false);
    setWindow("login");
  }

  function openModal() {
    setIsOpen(true);
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
        <AuthWindow window={window} onWindowChange={setWindow} onAuthSuccess={closeModal} />
      </Dialog>
    </>
  );
}

type AuthWindowProps = {
  window: Window;
  onWindowChange: (window: Window) => void;
  onAuthSuccess: () => void;
};
function AuthWindow({ window, onWindowChange, onAuthSuccess }: AuthWindowProps) {
  const formId = useId();
  const fetcher = useFetcher<RegisterActionData>();

  const action = window === "login" ? "/api/login" : "/api/register";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      onAuthSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  const changeWindowHandle = () => {
    onWindowChange(window === "login" ? "register" : "login");
  };

  return (
    <div className="mt-4 space-y-6">
      <fetcher.Form className="space-y-2" id={formId} method="POST" action={action}>
        <TextInput
          type="email"
          placeholder="Email"
          name="email"
          error={fetcher.data?.formErrors?.email}
          required
        />
        <TextInput
          type="password"
          placeholder="Пароль"
          name="password"
          error={fetcher.data?.formErrors?.password}
          required
        />

        {window === "register" && (
          <TextInput
            type="password"
            placeholder="Повторите пароль"
            name="retype-password"
            error={fetcher.data?.formErrors?.retypePassword}
            required
          />
        )}
      </fetcher.Form>

      <div className="space-y-2">
        <Button type="submit" fullWidth form={formId}>
          {window === "login" ? "Войти" : "Зарегистрироваться"}
        </Button>
        {fetcher.data?.error && (
          <p className="text-center text-sm text-rose-500">{fetcher.data.error}</p>
        )}

        <Button fullWidth variant="secondary" size="small" onClick={changeWindowHandle}>
          {window === "login" ? "Регистрация" : "Вход"}
        </Button>
      </div>
    </div>
  );
}
