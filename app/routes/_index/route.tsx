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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <header></header>

      <main>
        <NewTaskForm />

        <section>
          <ul>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
