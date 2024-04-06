import { Task } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

import { INTENTS } from "../../types";
import TaskItem from "../task-item/TaskItem";

type TasksListProps = { tasks: Task[] };
export default function TasksList({ tasks }: TasksListProps) {
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
    <section className="overflow-clip rounded-md bg-white py-2 shadow-lg shadow-slate-200">
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
    </section>
  ) : (
    <p className="p-3 text-center text-slate-400">Добавьте новую задачу в ваш список дел!</p>
  );
}
