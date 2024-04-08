import { Task } from "@prisma/client";

import { Box } from "~/components";
import { TaskItem } from "..";
import { useSyncLocalTasksOnLogin, useTasksActions } from "./hooks";

type TasksListProps = { tasks: Task[] };
export function TasksList({ tasks }: TasksListProps) {
  const { updateTask, deleteTask } = useTasksActions();
  const error = useSyncLocalTasksOnLogin();

  return tasks.length > 0 ? (
    <Box className="overflow-clip py-2" border>
      {error && <p className="p-3 text-center text-rose-500">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
        ))}
      </ul>
    </Box>
  ) : (
    <p className="p-3 text-center text-slate-400">Добавьте новую задачу в ваш список дел!</p>
  );
}
