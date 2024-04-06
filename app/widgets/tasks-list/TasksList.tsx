import { Task } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

import { Box } from "~/components";
import { INTENTS } from "~/routes/_index/types";
import { TaskItem } from "..";

type TasksListProps = { tasks: Task[] };
export function TasksList({ tasks }: TasksListProps) {
  const fetcher = useFetcher();

  const updateTaskHandle = (task: Task) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(task)) {
      formData.append(key, value.toString());
    }
    formData.append("intent", INTENTS.updateTask);
    fetcher.submit(formData, { method: "POST", navigate: false });
  };

  const deleteTaskHandle = (task: Task) => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("intent", INTENTS.deleteTask);
    fetcher.submit(formData, { method: "POST", navigate: false });
  };

  return tasks.length > 0 ? (
    <Box className="overflow-clip py-2" border>
      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={updateTaskHandle}
            onDelete={deleteTaskHandle}
          />
        ))}
      </ul>
    </Box>
  ) : (
    <p className="p-3 text-center text-slate-400">Добавьте новую задачу в ваш список дел!</p>
  );
}
