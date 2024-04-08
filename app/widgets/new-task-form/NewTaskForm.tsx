import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Box, TextInput } from "~/components";
import { INTENTS, TasksActionData } from "~/routes/_index/types";
import { useUser } from "~/utils/state-hooks";

export function NewTaskForm() {
  const user = useUser();
  const fetcher = useFetcher<TasksActionData>();

  const formRef = useRef<HTMLFormElement>(null!);

  useEffect(() => {
    if (fetcher.state !== "idle" || !!fetcher.data?.error) {
      return;
    }

    formRef.current.reset();
  }, [fetcher]);

  return (
    <Box>
      <fetcher.Form ref={formRef} method="POST" action={!user ? "?index&client=true" : ""}>
        <TextInput
          type="text"
          name="text"
          placeholder="Что хотите сделать?"
          autoComplete="off"
          error={fetcher.data?.error}
        />
        <input type="hidden" name="intent" value={INTENTS.createTask} />
        <input type="submit" hidden />
      </fetcher.Form>
    </Box>
  );
}
