export class Todo {
    userId: number;
    id?: number;
    title: string;
    completed: boolean;

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
}
