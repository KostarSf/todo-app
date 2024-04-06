import { CheckIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Task } from "@prisma/client";

type TaskItemProps = {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (task: Task) => void;
};
export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  return (
    <li className="group/item flex items-center gap-4 overflow-clip bg-white px-4 transition hover:bg-slate-50">
      <button
        className="grid h-6 w-6 place-items-center rounded-md border border-slate-300 bg-white transition hover:border-indigo-300"
        type="button"
        onClick={() => onUpdate({ ...task, done: !task.done })}
      >
        <CheckIcon
          className={
            "pointer-events-none -ml-1 -mt-3 h-10 w-10 text-indigo-400 transition " +
            (task.done ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0")
          }
        />
      </button>

      <p
        className={
          "flex-1 text-lg font-medium transition " +
          (task.done ? "text-green-600 line-through" : "text-slate-700")
        }
      >
        {task.text}
      </p>

      <button type="button" onClick={() => onDelete(task)}>
        <TrashIcon className="w-10 translate-y-5 p-2 text-transparent transition group-hover/item:translate-y-0 group-hover/item:text-slate-400 group-hover/item:hover:text-rose-600" />
      </button>
    </li>
  );
}
