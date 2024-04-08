import { ActionFunction, LoaderFunction, TypedResponse, json } from "@vercel/remix";

import { clearAuth, getAuthFromRequest, requireAuthCookie } from "~/auth.server";
import accounts from "~/models/accounts";
import tasks from "~/models/tasks";
import { INTENTS, TasksActionData, TasksLoaderData } from "./types";

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse<TasksLoaderData>> => {
  const userId = await getAuthFromRequest(request);
  if (!userId) {
    return json({ tasks: [], clientOnly: true });
  }

  const userTasks = await tasks.findAll(userId);
  return json({ tasks: userTasks, clientOnly: false });
};

export const action: ActionFunction = async ({
  request,
}): Promise<TypedResponse<TasksActionData>> => {
  const userId = await requireAuthCookie(request);

  const user = await accounts.find(userId);
  if (!user) {
    return clearAuth("/");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === INTENTS.createTask) {
    let text = formData.get("text");
    const id = formData.get("id")?.toString();

    if (typeof text !== "string" || !(text = text.trim())) {
      return json({ error: "Вы не заполнили поле" }, { status: 400 });
    }

    await tasks.create(user.id, { id, text });
    return json({});
  }

  if (intent === INTENTS.updateTask) {
    const id = formData.get("id");
    const done = formData.get("done") === "true";

    if (typeof id !== "string" || !id) {
      return json({ error: "Id задачи должен быть указан" }, { status: 400 });
    }

    await tasks.update(id, { done });
    return json({});
  }

  if (intent === INTENTS.deleteTask) {
    const id = formData.get("id");
    if (typeof id !== "string" || !id) {
      return json({ error: "Id задачи должен быть указан" }, { status: 400 });
    }

    await tasks.delete(id);
    return json({});
  }

  return json({ error: "Неизвестный intent" }, { status: 400 });
};
