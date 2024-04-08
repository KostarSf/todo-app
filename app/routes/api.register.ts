import { ActionFunction, TypedResponse, json } from "@vercel/remix";

import { setAuthOnResponse } from "~/auth.server";
import accounts from "~/models/accounts";

export type RegisterActionData = {
  ok: boolean;
  formErrors?: {
    email?: string;
    password?: string;
    retypePassword?: string;
  };
  error?: string;
};

export const action: ActionFunction = async ({
  request,
}): Promise<TypedResponse<RegisterActionData>> => {
  const formData = await request.formData();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const retypePassword = String(formData.get("retype-password") || "");

  const formErrors = await validate(email, password, retypePassword);
  if (formErrors) {
    return json({ ok: false, formErrors }, { status: 400 });
  }

  const user = await accounts.create(email, password);
  const response: TypedResponse<RegisterActionData> = json({ ok: true });
  return setAuthOnResponse(response, user.id);
};

async function validate(email: string, password: string, retypePassword: string) {
  const formErrors: RegisterActionData["formErrors"] = {};

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

  if (retypePassword !== password) {
    formErrors.retypePassword = "Пароли не совпадают";
  }

  if (!formErrors.email && (await accounts.exists(email))) {
    formErrors.email = "Пользователь с таким Email уже существует";
  }

  return Object.keys(formErrors).length ? formErrors : null;
}
