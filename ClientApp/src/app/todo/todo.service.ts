import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Todo } from './todo.model';

@Injectable()
export class TodoService {

  private readonly API_URL = 'https://jsonplaceholder.typicode.com';
  private readonly TODO_URI: string = this.API_URL + '/todos/';

  constructor(private http: HttpClient) { }

  public getTodo(id: number): Observable<Todo> {
    const url = this.TODO_URI + id;
    return this.http
      .get<Todo>(url)
      .pipe(
        catchError(this.handleError<Todo>('getTodo'))
      );
  }

  public getAllTodos(): Observable<Todo[]> {
    return this.http
      .get<Todo[]>(this.TODO_URI)
      .pipe(
        catchError(this.handleError<Todo[]>('getAllTodos'))
      );
  }

  public createTodo(todo: Todo): Observable<Todo> {
    return this.http
      .post<Todo>(this.TODO_URI, todo)
      .pipe(
        catchError(this.handleError<Todo>('createTodo'))
      );
  }

  public updateTodo(id: number, newTitle: string): Observable<Todo> {
    const url = this.TODO_URI + id;
    return this.http
      .put<Todo>(url, new Todo({ id: id, title: newTitle }))
      .pipe(
        catchError(this.handleError<Todo>('updateTodo'))
      );
  }

  public deleteTodo(id: number): Observable<string> {
    const url = this.TODO_URI + id;
    return this.http
      .delete<string>(url)
      .pipe(
        catchError(this.handleError<string>('deleteTodo'))
      );
  }

  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {

      let errorMessage = 'Unfortunately, something went wrong. Please try again later.';
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
        errorMessage = (error && error.error && error.error.message) || errorMessage;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        errorMessage = (error && error.error && error.error.Message) || errorMessage;
      }
      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}