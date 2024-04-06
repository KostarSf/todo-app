import { Task } from "@prisma/client";
import { randomUUID } from "~/utils/crypto";

export class TasksClientManager {
  private static STORAGE_ENTRY = "todos";

  tasks: Task[];

  constructor() {
    this.tasks = this.parseTasksFromJSON();
  }

  addTask(text: string, done = false) {
    this.tasks.push({
      id: randomUUID(),
      text: text,
      done: done,
      order: this.tasks.length + 1,
      accountId: "0",
    });

    return this;
  }

  updateTask(id: Task["id"], { done }: Partial<Omit<Task, "id" | "accountId">>) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      return "Задачи не существует";
    }

    if (typeof done === "boolean") {
      task.done = done;
    }

    return null;
  }

  deleteTask(id: Task["id"]) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = this.tasks.map((task, index) => {
      task.order = index + 1;
      return task;
    });

    return this;
  }

  save() {
    this.tasks = this.tasks.sort((a, b) => a.order - b.order);

    const json = JSON.stringify(this.tasks);
    localStorage.setItem(TasksClientManager.STORAGE_ENTRY, json);

    return this;
  }

  private parseTasksFromJSON(): Task[] {
    const json = localStorage.getItem(TasksClientManager.STORAGE_ENTRY);

    if (!json) {
      return [];
    }

    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) {
        return [];
      }

      return data.map(({ id, text, done, order, accountId }: Task) => {
        return { id, text, done, order, accountId };
      });
    } catch (err) {
      console.error(err);
    }

    return [];
  }
}
