import { Task, TaskDto } from "./task.model";

export class ClientTaskManager {
  private static STORAGE_ENTRY = "todos";

  tasks: Task[];

  constructor() {
    this.tasks = this.parseTasksFromJSON();
  }

  addTask(text: string, done = false) {
    const ordering = this.tasks.length + 1;
    this.tasks.push(new Task({ text, done, ordering }));

    return this;
  }

  updateTask(id: Task["id"], { done }: Partial<Omit<TaskDto, "id">>) {
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
      task.ordering = index + 1;
      return task;
    });

    return this;
  }

  save() {
    this.tasks = this.tasks.sort((a, b) => a.ordering - b.ordering);

    const json = JSON.stringify(this.tasks);
    localStorage.setItem(ClientTaskManager.STORAGE_ENTRY, json);

    return this;
  }

  private parseTasksFromJSON(): Task[] {
    const json = localStorage.getItem(ClientTaskManager.STORAGE_ENTRY);

    if (!json) {
      return [];
    }

    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((task) => new Task(task));
    } catch (err) {
      console.error(err);
    }

    return [];
  }
}
