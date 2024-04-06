import { useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";
import NewTaskForm from "./components/new-task-form/NewTaskForm";
import TasksList from "./components/tasks-list/TasksList";
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
        <TasksList tasks={tasks} />
      </main>

      <footer>
        <p className="p-2 text-center text-sm text-slate-500">© 2024 Максим Песков</p>
      </footer>
    </div>
  );
}
