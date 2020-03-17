import { UserService } from './../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { QuestionAndAnswer } from './../QuestionAndAnswer';
import { Subscription, interval } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr'
import { subscriptionUser } from './subscriptionUser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  userDetails;
  userWithCrops;
  questionWithAnswer;
  usersub: subscriptionUser[];
  public question: QuestionAndAnswer = new QuestionAndAnswer();
  public questionsWithOutAnswer: QuestionAndAnswer[];
  public answeredQuestion: QuestionAndAnswer = new QuestionAndAnswer();
  public num: number = 0;
  tableMode: boolean = true;
  public intervalSub: Subscription;
  questionMode: boolean = false;
  uploadForm: FormGroup;
  connection: HubConnection;
  constructor(private router: Router, public service: UserService, private formBuilder: FormBuilder, private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.onLoaded();
    this.intervalTimer();

    this.connection = new HubConnectionBuilder().withUrl('http://localhost:5077/Echo',{accessTokenFactory:()=> localStorage.getItem('token')}).build();
    this.connection.on('send', (data: QuestionAndAnswer) => { 
      for(let i=0; i<this.usersub.length; i++){
          if(this.usersub[i].user_Sub== data.userId){
            this.service.toastr.warning(data.question,data.answer);
          }
      }
      if(data.userId===this.userDetails.id){
        this.questionWithAnswer.push(data);
      }
      this.questionsWithOutAnswer.splice(this.questionsWithOutAnswer.map(e=>e.id).indexOf(data.id), 1)
      
    });
    this.connection.start().then(() => console.log('Connected echo'));
  }


  onLoaded() {
    this.uploadForm = this.formBuilder.group({
      image: [null]
    });
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      }
    );

    this.service.getUsersWithCrops().subscribe(
      res => {
        this.userWithCrops = res;
      },
      err => {
        console.log(err);
      }
    );

    this.service.getQuestionWithAnswer().subscribe(
      res => {
        this.questionWithAnswer = res;
      },
      err => {
        console.log(err);
      }
    );

    this.service.getQuestionWithOutAnswer().subscribe(
      res => {
        this.questionsWithOutAnswer = res;
      },
      err => {
        console.log(err);
      }
    );

    this.service.getMySubscib().subscribe(
      res => {
        this.usersub = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({ image: file });;
      this.uploadForm.get('image').updateValueAndValidity();
    }
  }

  getprofil(id: string) {
    //получить инфу пользователя и перейти на страиницу с ним
    this.router.navigate(['/userprofile/' + id]);
  }

  onSubmit() {
    var fromadata: any = new FormData();
    fromadata.append("image", this.uploadForm.get("image").value);
    this.service.UploadeImage(fromadata).subscribe(
      res => { this.onLoaded(); },
      err => { console.log(err); });
  }

  public cancel() {
    this.tableMode = true;
  }
  public add() {
    this.tableMode = !this.tableMode;
  }

  public saveQuestion() {
    console.log(this.question);
    this.service.setQuestion(this.question)
      .subscribe();
    this.tableMode = !this.tableMode;
  }

  public intervalTimer() {
    this.intervalSub = interval(1000).subscribe(() => this.getQuestionInterval());
  }

  private getQuestionInterval() {
    if (this.num == this.questionsWithOutAnswer.length - 1) {
      this.num = 0;
    }
    else {
      this.num++;
    }
  }

  giveAnswer(p: number) {
    this.answeredQuestion = this.questionsWithOutAnswer[p];
    this.questionMode = !this.questionMode;

    if (this.questionMode) {
      if (this.intervalSub)
        this.intervalSub.unsubscribe();
    }
    else {
      this.intervalTimer();
    }
  }

  saveAnswer() {
    this.service.setAnswer(this.answeredQuestion)
      .subscribe(data => { this.connection.invoke("Echo", data);  });

    this.questionMode = !this.questionMode;
    this.intervalTimer();
  }
}
