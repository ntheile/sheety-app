import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { Observable } from 'rxjs';

import { TodoService } from './todo.service';
import { Todo } from './todo.model';



@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss']
})
export class TodoComponent {

    public todo: Todo;
    public todos: Todo[] = [];
    public todoCompleted: boolean = false;
    public createdTodo: Todo;
    public updatedTodo: Todo;
    public deletedTodo: string;

    public displayedColumns = ['id', 'userId', 'title', 'status'];
    public todosDataSource;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private apiService: TodoService) {
    }

    /**
     * getTodo
     */
    public getTodo(id: number) {
        this.apiService
            .getTodo(id)
        .subscribe(todo => this.todo = todo);
    }

    /**
     * getAllTodos
     */
    public getAllTodos() {
        this.apiService
            .getAllTodos()
            .subscribe(todos => {
                this.todos = todos;
                this.todosDataSource = new MatTableDataSource<Todo>(todos);
                this.todosDataSource.paginator = this.paginator;
            });
    }

    public createTodo(todo: Todo) {
        this.apiService
            .createTodo(todo)
            .subscribe(newTodo => this.createdTodo = newTodo);
    }

    public updateTodo(id: number, title: string) {
        this.apiService
            .updateTodo(id, title)
            .subscribe(todo => this.updatedTodo = todo);
    }

    public deleteTodo(id: number) {
        this.apiService
            .deleteTodo(id)
            .subscribe();
    }
}
