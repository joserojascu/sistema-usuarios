import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isId:number =0;
  users: any;
  editar = false;
  private destroy = new Subject<any>();
  private usersSubject = new BehaviorSubject <any>(null);
  baseForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    age: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    rol: ['', [Validators.required]],
    
  });
  constructor(private userSvc:UsersService, private fb: FormBuilder, private authSvc: AuthService) { }
  
  ngOnInit() {
    this.isId = this.authSvc.getCurrentUser();
    this.userSvc.getById(this.isId).subscribe((users) => {
      this.users = users;
      this.loadUserInfo(this.users); // Llama a this.loadUserInfo dentro del subscribe
    });
  }

  loadUserInfo(user: any): void {
    if (user) {
      this.baseForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        password:  '',
        rol: user.rol || '',
        age: user.age || '',
        phone: user.phone || '',
        gender: user.gender || ''
      });
    }
  }

  actualizar(){ 
    const formValue = this.baseForm.value;
    const userData :any = {
      firstName: formValue.firstName || '', // Convertir a string y establecer un valor por defecto si es null o undefined
      lastName: formValue.lastName || '', // Convertir a string y establecer un valor por defecto si es null o undefined
      password: formValue.password || '', // Convertir a string y establecer un valor por defecto si es null o undefined
      rol:formValue.rol || '',
      age:formValue.age || '',
      phone:formValue.phone || '',
      gender:formValue.gender || '',
    };
    const userId = this.isId;
    console.log(userId,userData )
    this.userSvc.update(userId, userData).subscribe((res) => {
      window.alert("Actualizado Correctamente");
    }); 
  }

  checkField(field:string): any{
    return ( (this.baseForm.get(field)?.touched || this.baseForm.get(field)?.dirty) 
    && !this.baseForm.get(field)?.valid);
   }

  getErrorMessage(field: string): string {
    let message = '';
    const formField = this.baseForm.get(field);
  
    if (formField?.errors?.hasOwnProperty('required')) {
      message = 'Campo requerido';
    } else if (formField?.hasError('minlength')) {
      message = 'Son mínimo 5 caracteres';
    }
    
    return message;
  }
}
