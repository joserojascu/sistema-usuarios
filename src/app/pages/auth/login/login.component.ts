import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@app/shared/models/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide =true;
  isPass = false;
  private isValidEmail = /\S+@\S+\.\s+/;
  private subscription: Subscription = new Subscription();
  loginForm = this.fb.group({
    firstName:['', [Validators.required, Validators.required]],
    password:['', [Validators.required, Validators.minLength(5)]],
  });
  

 constructor(private authSvc: AuthService, private fb:FormBuilder, private router:Router){}

 
 ngOnInit():void{}
 ngOnDestroy():void{
  this.subscription.unsubscribe();
 }

 onLogin():void{
  if(this.loginForm.invalid){
    return;
  }
  const formValue = this.loginForm.value;
  const userData: User = {
    firstName: formValue.firstName || '', // Convertir a string y establecer un valor por defecto si es null o undefined
    password: formValue.password || '', // Convertir a string y establecer un valor por defecto si es null o undefined
  };
  this.subscription.add(
  this.authSvc.login(userData).subscribe((res) => {
    console.log(res, "res")
    if (res) {
      this.router.navigate(['']);
    }
    else {
      // Si la respuesta es falsa (contraseña incorrecta), mostrar el mensaje
      console.log("ingrese")
      this.isPass = true;
    }
  })
  );
 }
 getErrorMessage(field: string): string {
  let message = '';
  const formField = this.loginForm.get(field);

  if (formField?.errors?.hasOwnProperty('required')) {
    message = 'Campo requerido';
  } else if (formField?.hasError('minlength')) {
    message = 'Son mínimo 5 caracteres';
  }
  
  return message;
}

 isValidField(field:string): any{
  return ( (this.loginForm.get(field)?.touched || this.loginForm.get(field)?.dirty) 
  && !this.loginForm.get(field)?.valid);
 }
}

