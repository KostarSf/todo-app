import { useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";
import NewTaskForm from "./components/new-task-form/NewTaskForm";
import TaskItem from "./components/task-item/TaskItem";
import { TasksLoaderData } from "./types";

export const meta: MetaFunction = () => {
  return [
    { title: "Список задач" },
    { name: "description", content: "Еще одно приложение для ведения списка задач!" },
  ];
};

export { clientAction, clientLoader } from "./client";

export function HydrateFallback() {
  return <p>Загрузка...</p>;
}

export default function Index() {
  const tasks = useLoaderData<TasksLoaderData>();

  return (
    <div className="flex min-h-svh flex-col">
      <header></header>

      <main className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-4 p-2 md:justify-center">
        <NewTaskForm />

        {tasks.length > 0 ? (
          <section className="overflow-clip rounded-md bg-white py-2 shadow-lg shadow-slate-200">
            <ul>
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              {tasks.length === 0 && <li></li>}
            </ul>
          </section>
        ) : (
          <p className="p-3 text-center text-slate-400">Добавьте новую задачу в ваш список дел!</p>
        )}
      </main>

      <footer>
        <p className="p-2 text-center text-sm text-slate-500">© 2024 Максим Песков</p>
      </footer>
    </div>
  );
}
