import { Task } from "@prisma/client";

export type TasksLoaderData = Task[];
export type TasksActionData = { error?: string };

export const INTENTS = {
  createTask: "create-task",
  updateTask: "update-task",
  deleteTask: "delete-task",
} as const;