import { Form, useFetchers } from "@remix-run/react";
import { useRef } from "react";

import { Box, TextInput } from "~/components";
import { INTENTS } from "~/routes/_index/types";
import { randomUUID } from "~/utils/crypto";
import { useUser } from "~/utils/state-hooks";

export function NewTaskForm() {
  const user = useUser();

  const formRef = useRef<HTMLFormElement>(null!);
  const newIdRef = useRef(randomUUID());

  const fetchers = useFetchers().filter(
    (fetcher) => fetcher.formData?.get("intent") === INTENTS.createTask,
  );
  const isLoading = !!fetchers.length;

  const clearInputOnSubmit = () => {
    setTimeout(() => {
      formRef.current.reset();
      newIdRef.current = randomUUID();
    }, 0);
  };

  return (
    <Box>
      <Form
        ref={formRef}
        method="POST"
        action={!user ? "?index&client=true" : ""}
        onSubmit={clearInputOnSubmit}
        navigate={false}
      >
        <TextInput
          type="text"
          name="text"
          placeholder="Что хотите сделать?"
          autoComplete="off"
          loading={isLoading}
          required
        />
        <input type="hidden" name="id" value={newIdRef.current} />
        <input type="hidden" name="intent" value={INTENTS.createTask} />
        <input type="submit" hidden />
      </Form>
    </Box>
  );
}
