import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { QuestionAndAnswer } from 'src/app/shared/model/QuestionAndAnswer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  QuestionWithAnswer: any;
  isLoading:boolean=true;
  constructor(public service: UserService, private router: Router) { }

  ngOnInit(): void {
    this.service.getQuestionWithAnswer().subscribe(
      res => {
        this.QuestionWithAnswer = res;
        this.QuestionWithAnswer.forEach(item => {
          item.date = this.service.dateDifference(new Date(item.date), new Date());
          item.ratingCount=0;
          item.answers.forEach(answer => item.ratingCount += answer.ratings.length);
      });
      this.isLoading=false;
    },
      err => {
        console.log(err);
      }
    );
  }
 
  deleteQuestion(id:string){
    console.log(id);
    this.service.deleteQuestion(id).subscribe(
      res => {
        this.ngOnInit();
    },
      err => {
        console.log(err);
      }
    );
  }

  ShowQuestion(id: string) {
    this.router.navigate(['/home/question/showquestion/' + id]);
  }
}
