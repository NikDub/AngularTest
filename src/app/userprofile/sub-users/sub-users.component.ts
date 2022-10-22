import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-sub-users',
  templateUrl: './sub-users.component.html',
  styleUrls: ['./sub-users.component.scss']
})
export class SubUsersComponent implements OnInit {

  _userid;
  userWithCrops;
  isLoading:boolean=true;

  @Input() set userId(userId:string){
    this._userid=userId;
    this.isLoading=true;
    this.ngOnInit();
  };
  get userId(){
    return this._userid;
  }



  constructor(public service: UserService) { }

  ngOnInit(): void {
    this.service.getSubCropsById(this._userid).subscribe(
      res => {
        this.userWithCrops = res;
        this.isLoading=false;
      },
      err => {
        console.log(err);
      }
    );
  }

}
