import { ClientActionFunctionArgs, ClientLoaderFunctionArgs, json } from "@remix-run/react";
import { TypedResponse } from "@vercel/remix";

import { TasksClientManager } from "~/models/tasks.client-manager";
import { INTENTS, TasksActionData, TasksLoaderData } from "./types";

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs): Promise<TasksLoaderData> => {
  const data = await serverLoader<TasksLoaderData>();
  if (data.clientOnly) {
    return { ...data, tasks: new TasksClientManager().tasks };
  }

  return data;
};
clientLoader.hydrate = true;

export const clientAction = async ({
  request,
  serverAction,
}: ClientActionFunctionArgs): Promise<TypedResponse<TasksActionData>> => {
  const isClient = new URL(request.url).searchParams.has("client");
  if (isClient) {
    return performClientIntents(request);
  }

  const data = await serverAction<TasksActionData>();
  return json(data, { status: data.error ? 400 : 200 });
};

async function performClientIntents(request: Request): Promise<TypedResponse<TasksActionData>> {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const taskManager = new TasksClientManager();

  if (intent === INTENTS.createTask) {
    const text = formData.get("text")?.toString().trim();
    const id = formData.get("id")?.toString();

    if (typeof text !== "string" || !text) {
      return json({ error: "Вы не заполнили поле" }, { status: 400 });
    }

    taskManager.addTask({ id, text }).save();
    return json({});
  }

  if (intent === INTENTS.updateTask) {
    Object.fromEntries(formData.entries());

    const id = formData.get("id")?.toString();
    const done = formData.get("done") === "true";

    if (typeof id !== "string" || !id) {
      return json({ error: "Id задачи должен быть указан" }, { status: 400 });
    }

    const error = taskManager.updateTask(id, { done });
    if (error) {
      return json({ error }, { status: 400 });
    }

    taskManager.save();
    return json({});
  }

  if (intent === INTENTS.deleteTask) {
    const id = formData.get("id")?.toString();

    if (typeof id !== "string" || !id) {
      return json({ error: "Id задачи должен быть указан" }, { status: 400 });
    }

    taskManager.deleteTask(id).save();
    return json({});
  }

  return json({ error: "Неизвестный intent" }, { status: 400 });
}
