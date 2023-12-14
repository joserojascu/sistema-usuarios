import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

import { UserResponse, User, Roles } from '@shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<Roles>(null);
  private userToken = new BehaviorSubject<string>('');
  constructor(private http:HttpClient, private router:Router) { 
    this.checkToken();
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }
 get isAdmin():Observable<any>{
  return this.role.asObservable();
 }

 get userTokenValue():string{
  return this.userToken.getValue();
 }
  login(authData: User): Observable<UserResponse | void> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/login`, authData).pipe(
      map((user: UserResponse) => {
        this.saveLocalStorage(user);   
        this.loggedIn.next(true); 
        this.role.next(user.role);  
        this.userToken.next(user.token);
        return user;  
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err); // Propaga el error utilizando throwError
      })
    );
  }

  logout():void{
    localStorage.removeItem('user');
    this.loggedIn.next(false); 
    this.userToken.next('');
    this.router.navigate(['/login'])    
  }

  private checkToken(): void {
    const user = localStorage.getItem('user');

    if (user) {
      const isExpired = helper.isTokenExpired(JSON.parse(user).token);
      console.log('isExpired', isExpired)
      if (isExpired) {
        this.logout();
      } else {
        this.loggedIn.next(true);
        this.role.next(JSON.parse(user).role);
        this.userToken.next(JSON.parse(user).token);
      }
    }
  }
  private readToken():void {

  }
  private saveLocalStorage(user:UserResponse):void {
    // localStorage.setItem('token', token);
    const{ userId,message, ...rest} =user;
    localStorage.setItem('user', JSON.stringify(rest))

  }
  private handlerError():void{

  }
}
