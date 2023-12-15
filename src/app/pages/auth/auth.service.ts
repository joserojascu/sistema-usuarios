import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

import { UserResponse, User, Roles } from '@shared/models/user.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<Roles>(null);
  private userToken = new BehaviorSubject<string>('');

  userID:number =0;
  isPassword:boolean=false;
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
 
 getCurrentUser(){
  return this.userID;
 }



 login(authData: User): Observable<UserResponse | void> {
  return this.http.post<UserResponse>(`${environment.apiUrl}/login`, authData).pipe(
    map((user: UserResponse) => {
      this.saveLocalStorage(user);
      this.loggedIn.next(true);
      this.userToken.next(user.token);
      this.role.next(user.rol);

      return user;
    }),
    tap(
      () => {}, // Operador tap para manejar el flujo sin modificar los datos
      (err) => {
        if (err && err.error && err.error.message === 'Contraseña incorrecta') {
          // Manejar el error específico de contraseña incorrecta aquí
          console.log('Contraseña incorrecta');
          this.isPassword = true;
          // Puedes realizar acciones específicas, mostrar un mensaje al usuario, etc.
        } else {
          // Otros errores
          console.error('Error en el inicio de sesión', err);
        }
      }
    )
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
      this.userID = JSON.parse(user).userId;
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
    const{message, ...rest} =user;
    localStorage.setItem('user', JSON.stringify(rest))

  }
  private handlerError():void{

  }
}
