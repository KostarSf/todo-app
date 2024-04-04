export interface TaskDto {
  id?: string;
  text: string;
  done: boolean;
  ordering: number;
}

export class Task {
  id: string;
  text: string;
  done: boolean;
  ordering: number;

  constructor(taskDto: TaskDto) {
    this.id = taskDto.id || crypto.randomUUID();
    this.text = taskDto.text;
    this.done = taskDto.done;
    this.ordering = taskDto.ordering;
  }
}

export function parseTasksFromJSON(json: string | null) {
  if (!json) {
    return [];
  }

  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(({ value }) => new Task(value));
  } catch (err) {
    console.error(err);
  }

  return [];
}
