import { Task } from "@prisma/client";

export type TasksLoaderData = { tasks: Task[]; clientOnly: boolean };
export type TasksActionData = { error?: string };

export const INTENTS = {
  createTask: "create-task",
  updateTask: "update-task",
  deleteTask: "delete-task",
} as const;
