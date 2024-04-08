import { ActionFunction, TypedResponse, json } from "@vercel/remix";

import { setAuthOnResponse } from "~/auth.server";
import accounts from "~/models/accounts";

export type LoginActionData = {
  ok: boolean;
  formErrors?: {
    email?: string;
    password?: string;
  };
  error?: string;
};

export const action: ActionFunction = async ({
  request,
}): Promise<TypedResponse<LoginActionData>> => {
  const formData = await request.formData();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  const formErrors = validate(email, password);
  if (formErrors) {
    return json({ ok: false, formErrors }, { status: 400 });
  }

  const userId = await accounts.authenticate(email, password);
  if (userId === false) {
    return json({ ok: false, error: "Неверный Email или пароль" }, { status: 400 });
  }

  const response: TypedResponse<LoginActionData> = json({ ok: true });
  return setAuthOnResponse(response, userId);
};

function validate(email: string, password: string) {
  const formErrors: LoginActionData["formErrors"] = {};

  if (!email) {
    formErrors.email = "Необходимо ввести Email";
  } else if (!email.includes("@")) {
    formErrors.email = "Пожалуйста, введите корректный Email";
  }

  if (!password) {
    formErrors.password = "Необходимо ввести пароль";
  } else if (password.length < 6) {
    formErrors.password = "Пароль должен содержать не менее 6 символов";
  }

  return Object.keys(formErrors).length ? formErrors : null;
}
