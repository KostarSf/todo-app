import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { clientAction } from "../../route";

export default function NewTaskForm() {
  const fetcher = useFetcher<typeof clientAction>();

  const formRef = useRef<HTMLFormElement>(null!);

  useEffect(() => {
    if (fetcher.state !== "idle" || !!fetcher.data?.error) {
      return;
    }

    formRef.current.reset();
  }, [fetcher]);

  return (
    <fetcher.Form ref={formRef} method="POST">
      <input type="text" name="text" placeholder="Что хотите сделать?" autoComplete="off" />
      <input type="hidden" name="intent" value="add-task" />
      <input type="submit" hidden />

      {fetcher.data?.error && <p>{fetcher.data.error}</p>}
    </fetcher.Form>
  );
}
