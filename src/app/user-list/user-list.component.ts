import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList:any;
  isLoadingUsers:boolean = true;
  constructor(private service: UserService) { }

  ngOnInit(): void 
  {
    this.service.getUsersWithCrops().subscribe(
      res=>{
        this.userList=res;
        this.isLoadingUsers=false;
      },
      err=>{
        console.log(err);
      }
    );
  }

}
