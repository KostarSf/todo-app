import { Prisma, Task } from "@prisma/client";

import { prisma } from "~/db.server";

class Tasks {
  create(accountId: Task["accountId"], taskDto: Omit<Prisma.TaskCreateInput, "account">) {
    return prisma.task.create({
      data: {
        ...taskDto,
        account: { connect: { id: accountId } },
      },
    });
  }

  createMany(accountId: Task["accountId"], tasks: Omit<Prisma.TaskCreateManyInput, "accountId">[]) {
    return prisma.task.createMany({
      data: tasks.map((task) => ({
        ...task,
        accountId: accountId,
      })),
    });
  }

  findAll(accountId: Task["accountId"]) {
    return prisma.task.findMany({
      where: { accountId },
      orderBy: { order: "asc" },
    });
  }

  update(taskId: Task["id"], taskDto: Omit<Prisma.TaskUpdateInput, "account" | "id">) {
    return prisma.task.update({
      where: { id: taskId },
      data: taskDto,
    });
  }

  delete(taskId: Task["id"]) {
    return prisma.task.delete({ where: { id: taskId } });
  }
}

export default new Tasks();
