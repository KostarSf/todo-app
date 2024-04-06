import { useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";

import { AuthButton, NewTaskForm, TasksList } from "~/widgets";
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
    <div className="flex min-h-svh flex-col space-y-8">
      <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-2">
        <h1 className="select-none font-mono text-2xl font-bold text-indigo-400">Todoerr</h1>

        <AuthButton />
      </header>

      <main className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-4 px-2 md:justify-center">
        <NewTaskForm />
        <TasksList tasks={tasks} />
      </main>

      <footer>
        <p className="p-2 text-center text-sm text-slate-500">© 2024 Максим Песков</p>
      </footer>
    </div>
  );
}
