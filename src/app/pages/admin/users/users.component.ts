import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '@app/shared/models/user.interface';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  isId:number =0;
  users: any;
  editar = false;
  private destroy = new Subject<any>();

  baseForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    age: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    rol: ['', [Validators.required]],
    
  });
  constructor(private userSvc:UsersService, private fb: FormBuilder) { 
  }

  ngOnInit(): void {
    this.userSvc.getAll().subscribe((user: User) => {
      this.users = user;
    });
  }







  openEdit(user: any){
    this.editar = true;
    this.isId =user.id;
    this.loadUserInfo(user);
    const model = document.getElementById('Modal');
    if(model != null){
      model.style.display = 'block';
    }
  }
  openAgregar(){
    this.loadUserInfo("");
    const model = document.getElementById('Modal');
    if(model != null){
      model.style.display = 'block';
    }
  }

  close(){
    this.editar =false;
    const model = document.getElementById('Modal');
    if(model != null){
      model.style.display = 'none';
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
      // Update result after deleting the user.
      this.userSvc.getAll().subscribe((users) => {
        this.users = users;
      });
    }); 
    this.close();
  }

  crear():void{
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
    // debugger
    // console.log(formValue);
    // console.log(userData);
  this.userSvc.new(userData).subscribe((res) => {

    window.alert("Agregado Correctamente");
    // Update result after deleting the user.
    this.userSvc.getAll().subscribe((users) => {
      this.users = users;
    });
  }); 
  this.close();
  }

  onDelete(userId: any){
    if (  window.confirm('Seguro que desea eliminar el usuario con id: ' + userId.id)) {
      this.userSvc
        .delete(userId.id)
        .pipe(takeUntil(this.destroy))
        .subscribe((res) => {
          window.alert(JSON.stringify(res));
          // Update result after deleting the user.
          this.userSvc.getAll().subscribe((users) => {
            this.users = users;
          });
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
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


  loadUserInfo(user: any): void {
    this.baseForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      password: user.password || '',
      rol: user.rol || '',
      age: user.age || '',
      phone: user.phone || '',
      gender: user.gender || ''
    });
  }

}
