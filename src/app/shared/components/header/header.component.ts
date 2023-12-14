import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAdmin = null;
  isLogged = false;

 private destroy = new Subject<any>();
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authSvc: AuthService){

  }
  ngOnInit(): void {
   
      this.authSvc.isLogged.pipe(takeUntil(this.destroy)).subscribe((res) => (this.isLogged = res));
      this.authSvc.isAdmin.pipe(takeUntil(this.destroy)).subscribe((res) => (this.isAdmin = res));
  }

  ngOnDestroy():void{
    this.destroy.next({});
    this.destroy.complete
   }

  onToggleSidenav():void{
    this.toggleSidenav.emit();
  }

  onLogout(){
   this.authSvc.logout();
  }
}
