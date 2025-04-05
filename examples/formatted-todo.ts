// Todo Item Example - Try editing this code!
// - Change the type definition
// - Add new class methods
// - Experiment with generics

class TodoItem<T> {
  private _completed: boolean = false;

  constructor(
    public id: number,
    public title: string,
    public description?: string,
    public metadata?: T
  ) {}

  get completed(): boolean {
    return this._completed;
  }

  complete(): void {
    this._completed = true;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this._completed,
      metadata: this.metadata,
    };
  }
}

// Example usage
type TaskMetadata = {
  priority: "high" | "medium" | "low";
  category: string;
  tags: string[];
};

const task = new TodoItem<TaskMetadata>(
  1,
  "Learn TypeScript",
  "Study advanced TypeScript features",
  {
    priority: "high",
    category: "programming",
    tags: ["typescript", "learning"],
  }
);

task.complete();
console.log(task.toJSON());
