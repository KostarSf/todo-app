import { ClientActionFunctionArgs } from "@remix-run/react";
import { ClientTaskManager } from "~/models/client-task-manager";
import { TasksActionData, TasksLoaderData } from "./types";

export const clientLoader = (): TasksLoaderData => {
  return new ClientTaskManager().tasks;
};
clientLoader.hydrate = true;

export const clientAction = async ({
  request,
}: ClientActionFunctionArgs): Promise<TasksActionData> => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const taskManager = new ClientTaskManager();

  if (intent === "add-task") {
    const text = formData.get("text")?.toString().trim();

    if (typeof text !== "string" || !text) {
      return { error: "Вы не заполнили задачу" };
    }

    taskManager.addTask(text).save();
    return {};
  }

  if (intent === "update-task") {
    const id = formData.get("id")?.toString();
    const done = Boolean(formData.get("done"));

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

  if (intent === "delete-task") {
    const id = formData.get("id")?.toString();

    if (typeof id !== "string" || !id) {
      return { error: "Id задачи должен быть указан" };
    }

    taskManager.deleteTask(id).save();
    return {};
  }

  return { error: "Неподерживаемое действие" };
};
