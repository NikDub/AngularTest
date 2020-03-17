import { Component, OnInit, Input } from '@angular/core';
import { UserService } from './../shared/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { subscriptionUser } from '../home/subscriptionUser';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styles: []
})
export class UserprofileComponent implements OnInit {
  userDetails;
  questionWithAnswer;
  userID;
  constructor(public service: UserService, private activateRoute: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userID=this.activateRoute.snapshot.params['id'];
    this.service.getUserProfileByID(this.userID).subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      }
    );

    this.service.getQuestionWithAnswerById(this.userID).subscribe(
      res=>{
        this.questionWithAnswer = res;
      },
      err=>{
        console.log(err);
      }
    );
  }


  onSubmit()
  {
    let usersub: subscriptionUser=new subscriptionUser();
    usersub.user_Sub = this.userID;
    this.service.setSub(usersub).subscribe();
    this.toastr.success('Subscribed successful.');
  }
}
