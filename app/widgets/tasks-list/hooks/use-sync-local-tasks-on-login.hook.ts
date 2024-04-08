import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import { TasksClientManager } from "~/models/tasks.client-manager";
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
