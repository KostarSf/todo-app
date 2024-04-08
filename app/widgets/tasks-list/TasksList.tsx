import { Task } from "@prisma/client";

import { Box } from "~/components";
import { useUser } from "~/utils/state-hooks";
import { TaskItem } from "..";
import { useOptimisticTasks, useSyncLocalTasksOnLogin } from "./hooks";

type TasksListProps = { tasks: Task[] };
export function TasksList({ tasks }: TasksListProps) {
  const user = useUser();
  const error = useSyncLocalTasksOnLogin();
  const optimisticTasks = useOptimisticTasks(tasks);

  return optimisticTasks.length > 0 ? (
    <Box className="overflow-clip py-2" border>
      {error && <p className="p-3 text-center text-rose-500">{error}</p>}
      <ul>
        {optimisticTasks.map((task) => (
          <TaskItem key={task.id} task={task} clientActions={!user} />
        ))}
      </ul>
    </Box>
  ) : (
    <p className="p-3 text-center text-slate-400">Добавьте новую задачу в ваш список дел!</p>
  );
}
