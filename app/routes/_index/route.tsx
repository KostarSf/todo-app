import { useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";

import { AuthButton, NewTaskForm, TasksList } from "~/widgets";
import { TasksLoaderData } from "./types";

export const meta: MetaFunction = () => {
  return [
    { title: "Todoerr" },
    { name: "description", content: "Еще одно приложение для ведения списка задач!" },
  ];
};

export { clientAction, clientLoader } from "./client";
export { action, loader } from "./server";

export function HydrateFallback() {
  return (
    <Layout>
      <span className="spinner mx-auto animate-spin"></span>
    </Layout>
  );
}

export default function Index() {
  const { tasks } = useLoaderData<TasksLoaderData>();

  return (
    <Layout>
      <NewTaskForm />
      <TasksList tasks={tasks} />
    </Layout>
  );
}

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col space-y-8">
      <header className="border-b border-slate-100 bg-white transition dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2">
          <h1 className="select-none font-mono text-2xl font-bold text-indigo-400">Todoerr</h1>

          <AuthButton />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-4 px-4 md:justify-center">
        {children}
      </main>

      <footer>
        <p className="p-2 text-center text-sm text-slate-500 transition dark:text-slate-600">
          © 2024 Максим Песков
        </p>
      </footer>
    </div>
  );
}
