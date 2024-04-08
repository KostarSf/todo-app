import { Task } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import { TasksClientManager } from "~/models/tasks.client-manager";
import { INTENTS } from "~/routes/_index/types";
import { UploadLocalTasksActionData } from "~/routes/api.upload-local-tasks";
import { useUser } from "~/utils/state-hooks";

export function useSyncLocalTasksOnLogin() {
  const user = useUser();
  const fetcher = useFetcher<UploadLocalTasksActionData>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      const taskManager = new TasksClientManager();
      taskManager.clearTasks().save();
    }
  }, [fetcher]);

  useEffect(() => {
    if (!user?.id || fetcher.state !== "idle") {
      return;
    }

    const tasks = new TasksClientManager().tasks;
    if (!tasks.length) {
      return;
    }

    const formData = new FormData();
    formData.append("tasks", JSON.stringify(tasks));

    fetcher.submit(formData, {
      method: "POST",
      navigate: false,
      action: "/api/upload-local-tasks",
    });
  }, [user?.id, fetcher]);

  return fetcher.data?.error;
}

export function useTasksActions() {
  const user = useUser();

  const fetcher = useFetcher();
  const actionUrl = user ? "" : "/?index&client=true";

  const updateTask = (task: Task) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(task)) {
      formData.append(key, value.toString());
    }
    formData.append("intent", INTENTS.updateTask);
    if (!user) {
      formData.append("client", "true");
    }

    fetcher.submit(formData, { method: "POST", navigate: false, action: actionUrl });
  };

  const deleteTask = (task: Task) => {
    const formData = new FormData();

    formData.append("id", task.id);
    formData.append("intent", INTENTS.deleteTask);
    if (!user) {
      formData.append("client", "true");
    }

    fetcher.submit(formData, { method: "POST", navigate: false, action: actionUrl });
  };

  return { updateTask, deleteTask };
}
