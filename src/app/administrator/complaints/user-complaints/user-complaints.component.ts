import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-complaints',
  templateUrl: './user-complaints.component.html',
  styleUrls: ['./user-complaints.component.scss']
})
export class UserComplaintsComponent implements OnInit {

  userDetails: any;
  userComplainList:any;
  constructor(public service: UserService) { }

  
  ngOnInit(): void {
    this.loadingcompl();

    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      }
    );
  }
  loadingcompl(): void {
    this.service.getComplainUser().subscribe(res=>{this.userComplainList=res}, err=> console.log(err));
  }
  setRatingById(id: string) {
    this.service.postComplainSeenById(id).subscribe(
      res => {
        this.loadingcompl();
      },
      err => {
        console.log(err);
      }
    );
  }

  cheack(ratings) {
    if (ratings.seen)
      return true;
    else
      return false;
  }
}
