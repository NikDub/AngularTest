import { Component, OnInit } from '@angular/core';
import { UserService } from './../../shared/user.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-main-head',
  templateUrl: './main-head.component.html',
  styleUrls: ['./main-head.component.scss']
})
export class MainHeadComponent implements OnInit {

  likeList:any;
  questionList:any;
  answersList:any;
  subList:any;
  
  notificationCount:number=0;

  constructor( public service: UserService, private router: Router) { }
  categorylist: any;
  searchData$:any;
  searchDataUser$:any;
  private searchTerms = new Subject<string>();
  ngOnInit(): void {
    this.getNotification();
    this.service.getCategory().subscribe(
      res => {
        this.categorylist = res;
      },
      err => {
        console.log(err);
      }
    );

    this.searchData$ = this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term:string) => this.service.searchQuestion(term))
    );
    this.searchDataUser$ = this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term:string) => this.service.searchUser(term))
    );
  }
  getNotification(){
    this.service.getNotificationAnswer().subscribe(res=>{
      this.answersList=res;
      this.answersList.forEach(item => {
        item.date = this.service.dateDifference(new Date(item.date), new Date());
      });
      this.notificationCount+= this.answersList.length;
    },err=>{console.log(err)});
    this.service.getNotificationRating().subscribe(res=>{
      this.likeList=res
      this.likeList.forEach(item => {
        item.date = this.service.dateDifference(new Date(item.date), new Date());
      });
      this.notificationCount+= this.likeList.length;
    },err=>{console.log(err)});
    this.service.getNotificationSub().subscribe(res=>{
      this.subList=res
      this.subList.forEach(item => {
        item.date = this.service.dateDifference(new Date(item.date), new Date());
      });
      this.notificationCount+= this.subList.length;
    },err=>{console.log(err)});
    this.service.getNotificationQuestion().subscribe(res=>{
      this.questionList=res
      this.questionList.forEach(item => {
        item.date = this.service.dateDifference(new Date(item.date), new Date());
      });
      this.notificationCount+= this.questionList.length;
    },err=>{console.log(err)});
  }

  search(str:string)
  {
    if(str.length>0)
    {
      this.searchTerms.next(str);
    }
  }

  onLogout() {
    localStorage.removeItem('token');
    this.subList=null;
    this.likeList=null;
    this.answersList=null;
    this.questionList=null;
    this.router.navigate(['/']);
  }
  SeenNotifi(){
    this.service.getSeen().subscribe(res=>{setInterval(()=>{this.getNotification(); this.notificationCount=0;},80000)},err=>{console.log(err)})
  }
}
