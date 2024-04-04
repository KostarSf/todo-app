import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { TasksActionData } from "../../types";

export default function NewTaskForm() {
  const fetcher = useFetcher<TasksActionData>();

  const formRef = useRef<HTMLFormElement>(null!);

  useEffect(() => {
    if (fetcher.state !== "idle" || !!fetcher.data?.error) {
      return;
    }

    formRef.current.reset();
  }, [fetcher]);

  return (
    <fetcher.Form
      className="rounded-md bg-white px-4 py-2 shadow-lg shadow-slate-200 ring-indigo-400 transition focus-within:ring"
      ref={formRef}
      method="POST"
    >
      <input
        className="w-full bg-transparent text-lg font-medium text-slate-800 outline-none placeholder:text-slate-400 placeholder:transition focus:placeholder:text-slate-300"
        type="text"
        name="text"
        placeholder="Что хотите сделать?"
        autoComplete="off"
      />
      <input type="hidden" name="intent" value="add-task" />
      <input type="submit" hidden />

      {fetcher.data?.error && <p>{fetcher.data.error}</p>}
    </fetcher.Form>
  );
}
