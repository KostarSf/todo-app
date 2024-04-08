import { Task } from "@prisma/client";
import { useFetchers } from "@remix-run/react";
import { useMemo } from "react";

import { INTENTS } from "~/routes/_index/types";

export function useOptimisticTasks(tasks: Task[]) {
  const fetchers = useFetchers();

  const optimisticTasks = useMemo(() => {
    const tasksMap = new Map(tasks.map((task) => [task.id, task]));

    console.log(fetchers.length);

    // Created tasks
    fetchers
      .filter((fetcher) => fetcher.formData?.get("intent") === INTENTS.createTask)
      .forEach((fetcher) => {
        const task = {
          id: fetcher.formData?.get("id")?.toString() ?? "0",
          text: fetcher.formData?.get("text")?.toString() ?? "",
          done: false,
          order: 0,
          accountId: "0",
        };
        tasksMap.set(task.id, task);
      });

    // Updated tasks
    fetchers
      .filter((fetcher) => fetcher.formData?.get("intent") === INTENTS.updateTask)
      .forEach((fetcher) => {
        const task = {
          id: fetcher.formData?.get("id")?.toString() ?? "0",
          text: fetcher.formData?.get("text")?.toString() ?? "",
          done: fetcher.formData?.get("done") === "true",
          order: Number(fetcher.formData?.get("order") || 0),
          accountId: "0",
        };
        tasksMap.set(task.id, task);
      });

    // Deleted tasks
    fetchers
      .filter((fetcher) => fetcher.formData?.get("intent") === INTENTS.deleteTask)
      .forEach((fetcher) => {
        const taskId = fetcher.formData?.get("id")?.toString() ?? "0";
        tasksMap.delete(taskId);
      });

    return Array.from(tasksMap.values());
  }, [tasks, fetchers]);

  return optimisticTasks;
}
