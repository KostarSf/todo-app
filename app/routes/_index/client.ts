import { ClientActionFunctionArgs } from "@remix-run/react";
import { TasksClientManager } from "~/models/tasks.client-manager";
import { INTENTS, TasksActionData, TasksLoaderData } from "./types";

export const clientLoader = (): TasksLoaderData => {
  return new TasksClientManager().tasks;
};
clientLoader.hydrate = true;

export const clientAction = async ({
  request,
}: ClientActionFunctionArgs): Promise<TasksActionData> => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const taskManager = new TasksClientManager();

  if (intent === INTENTS.createTask) {
    const text = formData.get("text")?.toString().trim();

    if (typeof text !== "string" || !text) {
      return { error: "Вы не заполнили поле" };
    }

    taskManager.addTask(text).save();
    return {};
  }

  if (intent === INTENTS.updateTask) {
    Object.fromEntries(formData.entries());

    const id = formData.get("id")?.toString();
    const done = formData.get("done") === "true";

    if (typeof id !== "string" || !id) {
      return { error: "Id задачи должен быть указан" };
    }

    const error = taskManager.updateTask(id, { done });
    if (error) {
      return { error };
    }

    taskManager.save();
    return {};
  }

  if (intent === INTENTS.deleteTask) {
    const id = formData.get("id")?.toString();

    if (typeof id !== "string" || !id) {
      return { error: "Id задачи должен быть указан" };
    }

    taskManager.deleteTask(id).save();
    return {};
  }

  return { error: "Неподерживаемое действие" };
};
