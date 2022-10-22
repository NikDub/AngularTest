import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-answers-complaints',
  templateUrl: './answers-complaints.component.html',
  styleUrls: ['./answers-complaints.component.scss']
})
export class AnswersComplaintsComponent implements OnInit {

  userDetails: any;
  answerComplainList: any;
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
  loadingcompl()
  {
    this.service.getComplainAnswer().subscribe(res => { this.answerComplainList = res }, err => console.log(err));
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
