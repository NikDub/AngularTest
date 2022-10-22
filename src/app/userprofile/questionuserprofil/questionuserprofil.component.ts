import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionuserprofil',
  templateUrl: './questionuserprofil.component.html',
  styleUrls: ['./questionuserprofil.component.scss']
})
export class QuestionuserprofilComponent implements OnInit {
  QuestionWithAnswer: any;
  isLoadingQuest:boolean=true;
  _userid;
  @Input() set userId(userId:string){
    this._userid=userId;
    this.isLoadingQuest=true;
    this.ngOnInit();
  };
  get userId(){
    return this._userid;
  }
  constructor(public service: UserService, private router: Router) { }

  ngOnInit(): void {
    this.service.getQuestionById(this.userId).subscribe(
      res => {
        this.QuestionWithAnswer = res;
        this.QuestionWithAnswer.forEach(item => {
          item.date = this.service.dateDifference(new Date(item.date), new Date());
          item.ratingCount=0;
          item.answers.forEach(answer => item.ratingCount += answer.ratings.length);
        });
        this.isLoadingQuest = false;
      },
      err => {
        console.log(err);
      }
    );

  }
 

}
