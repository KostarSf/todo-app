import { useFetcher } from "@remix-run/react";
import { Task } from "~/models/task.model";

export default function TaskItem({ task }: { task: Task }) {
  const fetcher = useFetcher();

  const updateTaskDoneState = (done: boolean) => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("done", done ? "1" : "");
    formData.append("intent", "update-task");

    fetcher.submit(formData, { method: "POST", navigate: false });
  };

  const deleteTask = () => {
    const formData = new FormData();
    formData.append("id", task.id);
    formData.append("intent", "delete-task");

    fetcher.submit(formData, { method: "POST", navigate: false });
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => updateTaskDoneState(e.target.checked)}
      />
      <p>{task.ordering + ', ' + task.text}</p>
      <button type="button" onClick={deleteTask}>Удалить</button>
    </li>
  );
}
