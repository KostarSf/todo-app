import { Account } from "@prisma/client";
import { Form } from "@remix-run/react";

import { Button } from "~/components";

export function UserDialogButton({ user }: { user: Account }) {
  return (
    <Form method="POST" action="/api/logout">
      <Button type="submit" variant="secondary" size="small">
        {user.email}
      </Button>
    </Form>
  );
}
