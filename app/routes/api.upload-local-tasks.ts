import { Task } from "@prisma/client";
import { ActionFunction, TypedResponse, json } from "@vercel/remix";

import { requireAuthCookie } from "~/auth.server";
import accounts from "~/models/accounts";
import tasks from "~/models/tasks";

export type UploadLocalTasksActionData = {
  ok: boolean;
  error?: string;
};

export const action: ActionFunction = async ({
  request,
}): Promise<TypedResponse<UploadLocalTasksActionData>> => {
  const userId = await requireAuthCookie(request);

  const user = await accounts.find(userId);
  if (!user) {
    return json({ ok: false, error: "Такой пользователь не найден" }, { status: 404 });
  }

  const formData = await request.formData();
  const tasksJson = formData.get("tasks")?.toString();
  if (!tasksJson) {
    return json({ ok: false, error: "Необходимо передать список задач" }, { status: 400 });
  }

  try {
    const rawTasks = JSON.parse(tasksJson) as Task[];
    const tasksDtos = rawTasks.map(({ text, done, order }) => ({ text, done, order }));

    await tasks.createMany(user.id, tasksDtos);
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Не удалось сохранить задачи" }, { status: 500 });
  }

  return json({ ok: true }, { status: 201 });
};
