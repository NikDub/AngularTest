import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']

})
export class MainPageComponent implements OnInit {

  lastAnswer:any;
  lastQuestion:any;
  ratingsList:any;
  isLoadingQuest:boolean=true;
  isLoadingAnswer:boolean=true;
  isLoadingRatings:boolean=true;

  constructor(public service: UserService, private router: Router) { }

  ngOnInit(): void {
    this.service.getLastAnswer().subscribe(
      res => {
        this.lastAnswer = res;
        this.isLoadingAnswer=false;
      },
      err => {
        console.log(err);
      }
    );
    this.service.getLastQuestion().subscribe(
      res => {
        this.lastQuestion  = res;
        this.lastQuestion.forEach(item => {
          item.date = this.service.dateDifference(new Date(item.date), new Date());
          item.ratingCount=0;
          item.answers.forEach(answer => item.ratingCount += answer.ratings.length);
        });
        this.isLoadingQuest=false;
      },
      err => {
        console.log(err);
      }
    );

    this.service.getRatingList().subscribe(
      res => {
        this.ratingsList = res;
        this.isLoadingRatings=false;
      },
      err => {
        console.log(err);
      }
    );
  }
}
