import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { User } from '@app/shared/models/user.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/users/`)
      .pipe(catchError(this.handlerError));
  }
  getById(userId: number): Observable<User> {
    return this.http
      .get<any>(`${environment.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handlerError));
  }
  new(user: User): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users`, user)
      .pipe(catchError(this.handlerError));
  }

  update(userId: number, user: User) {
    return this.http
      .patch<User>(`${environment.apiUrl}/users/${userId}`, user)
      .pipe(catchError(this.handlerError));
  }

  delete(userId: number): Observable<{}> {
    return this.http
      .delete<User>(`${environment.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error:any): Observable<never> {
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
