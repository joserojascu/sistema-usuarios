import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '@app/shared/models/user.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any;
  constructor(private userSvc:UsersService) { 
  }

  ngOnInit(): void {
    this.userSvc.getAll().subscribe((user: User) => {
      this.users = user;
    });
  }

  public sortColumn: string = ''; // Columna por la que se ordenará
  public sortDirection: number = 1; // 1 para orden ascendente, -1 para orden descendente



  public sortTable(columnName: string): void {
    if (this.sortColumn === columnName) {
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 1;
    }

    // this.countries.sort((a, b) => {
    //   const valueA = a[columnName];
    //   const valueB = b[columnName];

    //   if (valueA < valueB) {
    //     return -1 * this.sortDirection;
    //   } else if (valueA > valueB) {
    //     return 1 * this.sortDirection;
    //   } else {
    //     return 0;
    //   }
    // });
  }


}
