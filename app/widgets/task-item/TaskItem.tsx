import { CheckIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Task } from "@prisma/client";
import { Form } from "@remix-run/react";
import clsx from "clsx";

import { INTENTS } from "~/routes/_index/types";

type TaskItemProps = {
  task: Task;
  clientActions?: boolean;
};
export function TaskItem({ task, clientActions }: TaskItemProps) {
  const action = clientActions ? "?index&client=true" : undefined;

  return (
    <li className="group/item overflow-clip px-4 transition hover:bg-slate-50 dark:hover:bg-slate-900">
      <Form className="flex items-center gap-4" method="POST" action={action} navigate={false}>
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="done" value={String(!task.done)} />
        <input type="hidden" name="text" value={task.text} />
        <input type="hidden" name="order" value={task.order} />

        <button
          className="grid h-6 w-6 place-items-center rounded-md border border-slate-300 bg-white ring-indigo-300 transition hover:border-indigo-300 focus:outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-800/50 dark:ring-indigo-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600"
          type="submit"
          name="intent"
          value={INTENTS.updateTask}
        >
          <CheckIcon
            className={clsx({
              "pointer-events-none -ml-1 -mt-3 h-10 w-10 text-indigo-400 transition": true,
              "translate-y-0 opacity-100": task.done,
              "translate-y-10 opacity-0": !task.done,
            })}
          />
        </button>

        <p
          className={clsx({
            "flex-1 text-lg font-semibold transition": true,
            "text-green-600 line-through dark:text-green-400": task.done,
            "text-slate-700 dark:text-slate-300": !task.done,
          })}
        >
          {task.text}
        </p>

        <button
          className="group/icon my-1 rounded-md ring-indigo-300 transition focus:outline-none focus:ring dark:ring-indigo-600"
          type="submit"
          name="intent"
          value={INTENTS.deleteTask}
        >
          <TrashIcon className="w-10 translate-y-5 p-2 text-transparent transition group-hover/item:translate-y-0 group-hover/item:text-slate-400 group-hover/item:hover:text-rose-600 group-focus-visible/icon:translate-y-0 group-focus-visible/icon:text-rose-600 dark:group-hover/item:text-slate-600" />
        </button>
      </Form>
    </li>
  );
}
