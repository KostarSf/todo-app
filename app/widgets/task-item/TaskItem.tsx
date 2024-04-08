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
    <li className="group/item overflow-clip bg-white px-4 transition hover:bg-slate-50">
      <Form className="flex items-center gap-4" method="POST" action={action} navigate={false}>
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="done" value={String(!task.done)} />
        <input type="hidden" name="text" value={task.text} />
        <input type="hidden" name="order" value={task.order} />

        <button
          className="grid h-6 w-6 place-items-center rounded-md border border-slate-300 bg-white transition hover:border-indigo-300"
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
            "flex-1 text-lg font-medium transition": true,
            "text-green-600 line-through": task.done,
            "text-slate-700": !task.done,
          })}
        >
          {task.text}
        </p>

        <button type="submit" name="intent" value={INTENTS.deleteTask}>
          <TrashIcon className="w-10 translate-y-5 p-2 text-transparent transition group-hover/item:translate-y-0 group-hover/item:text-slate-400 group-hover/item:hover:text-rose-600" />
        </button>
      </Form>
    </li>
  );
}
