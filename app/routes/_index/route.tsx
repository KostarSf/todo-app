import { ClientActionFunctionArgs, useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";
import { ClientTaskManager } from "~/models/client-task-manager";
import NewTaskForm from "./components/new-task-form/NewTaskForm";
import TaskItem from "./components/task-item/TaskItem";

export const meta: MetaFunction = () => {
  return [
    { title: "Список задач" },
    { name: "description", content: "Еще одно приложение для ведения списка задач!" },
  ];
};

export const clientLoader = () => {
  return new ClientTaskManager().tasks;
};
clientLoader.hydrate = true;

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const taskManager = new ClientTaskManager();

  if (intent === "add-task") {
    const text = formData.get("text")?.toString().trim();

    if (typeof text !== "string" || !text) {
      return { error: "Вы не заполнили задачу" };
    }

    taskManager.addTask(text).save();
    return {};
  }

  if (intent === "update-task") {
    const id = formData.get("id")?.toString();
    const done = Boolean(formData.get("done"));

    if (typeof id !== "string" || !id) {
      return { error: "Id задачи должен быть указан" };
    }

    const error = taskManager.updateTask(id, { done });
    if (error) {
      return { error };
    }

    taskManager.save();
    return {};
  }

  if (intent === "delete-task") {
    const id = formData.get("id")?.toString();

    if (typeof id !== "string" || !id) {
      return { error: "Id задачи должен быть указан" };
    }

    taskManager.deleteTask(id).save();
    return {};
  }

  return { error: "Неподерживаемое действие" };
};

export function HydrateFallback() {
  return <p>Загрузка...</p>;
}

export default function Index() {
  const tasks = useLoaderData<typeof clientLoader>();

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
