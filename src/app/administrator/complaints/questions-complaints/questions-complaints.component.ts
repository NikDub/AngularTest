import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-questions-complaints',
  templateUrl: './questions-complaints.component.html',
  styleUrls: ['./questions-complaints.component.scss']
})
export class QuestionsComplaintsComponent implements OnInit {

  userDetails: any;
  qustionComplainList:any;
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
    this.service.getComplainQuestion().subscribe(res=>{this.qustionComplainList=res}, err=> console.log(err));
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
