import { Prisma, Task } from "@prisma/client";

import { prisma } from "~/db.server";

class Tasks {
  async create(accountId: Task["accountId"], taskDto: Omit<Prisma.TaskCreateInput, "account">) {
    return prisma.$transaction(async (prisma) => {
      const maxOrderAgregation = await prisma.task.aggregate({
        where: { accountId },
        _max: { order: true },
      });

      return prisma.task.create({
        data: {
          ...taskDto,
          order: (maxOrderAgregation._max.order || 0) + 1,
          account: { connect: { id: accountId } },
        },
      });
    });
  }

  async createMany(
    accountId: Task["accountId"],
    tasks: Omit<Prisma.TaskCreateManyInput, "accountId">[],
  ) {
    return prisma.$transaction(async (prisma) => {
      const maxOrderAgregation = await prisma.task.aggregate({
        where: { accountId },
        _max: { order: true },
      });

      return prisma.task.createMany({
        data: tasks.map((task, index) => ({
          ...task,
          order: (maxOrderAgregation._max.order || 0) + 1 + index,
          accountId: accountId,
        })),
      });
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
    return prisma.$transaction(async (prisma) => {
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (!task) {
        return;
      }

      await Promise.all([
        prisma.task.delete({ where: { id: taskId } }),
        prisma.task.updateMany({
          where: {
            accountId: task.accountId,
            order: { gt: task.order },
          },
          data: { order: { decrement: 1 } },
        }),
      ]);
    });
  }
}

export default new Tasks();
