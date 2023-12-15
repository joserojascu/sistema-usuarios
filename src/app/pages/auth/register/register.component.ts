import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UsersService } from '@app/pages/admin/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  users: any;
  hide =true;
  isPass = false;
  private isValidEmail = /\S+@\S+\.\s+/;
  private subscription: Subscription = new Subscription();
  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    age: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    rol: ['', [Validators.required]],
  });

  constructor(private authSvc: AuthService, private fb:FormBuilder, private router:Router,private userSvc:UsersService) { }

  ngOnInit() {
  }

  getErrorMessage(field: string): string {
    let message = '';
    const formField = this.registerForm.get(field);
  
    if (formField?.errors?.hasOwnProperty('required')) {
      message = 'Campo requerido';
    } else if (formField?.hasError('minlength')) {
      message = 'Son mínimo 5 caracteres';
    }
    
    return message;
  }
  
   isValidField(field:string): any{
    return ( (this.registerForm.get(field)?.touched || this.registerForm.get(field)?.dirty) 
    && !this.registerForm.get(field)?.valid);
   }

   register():void{
    const formValue = this.registerForm.value;
    const userData :any = {
      firstName: formValue.firstName || '', // Convertir a string y establecer un valor por defecto si es null o undefined
      lastName: formValue.lastName || '', // Convertir a string y establecer un valor por defecto si es null o undefined
      password: formValue.password || '', // Convertir a string y establecer un valor por defecto si es null o undefined
      rol:formValue.rol || '',
      age:formValue.age || '',
      phone:formValue.phone || '',
      gender:formValue.gender || '',
    };
    // debugger
    // console.log(formValue);
    // console.log(userData);
  this.userSvc.new(userData).subscribe((res) => {
    window.alert("Agregado Correctamente");
    this.router.navigate(['/login']);
  });
}
}
