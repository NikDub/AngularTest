import { Component, OnInit, Input } from '@angular/core';
import { UserService } from './../shared/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { subscriptionUser } from '../shared/model/subscriptionUser';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.scss']
})
export class UserprofileComponent implements OnInit {
  userDetails;
  questionWithAnswer;
  usersub: subscriptionUser[];
  userID;
  userIdForCheack;
  chke;
  isLoadingUser:boolean=true;
  compModel = this.fb.group({
    Value: ['', Validators.compose([Validators.required, Validators.maxLength(500)])]
  });

  userModel = this.fb.group({
    userName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])]
  });

  compCount: Number = 500;

  constructor(public service: UserService, private activateRoute: ActivatedRoute,  private fb: FormBuilder, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(({ id }) => { this.isLoadingUser=true;this.loadDate(id);});
  }

  loadDate(id){
    this.userID=id;
    if (this.checkUSer()) {

      this.service.getUSerId().subscribe(
        res => {
          this.userIdForCheack = res;
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

    this.service.getUserProfileByID(id).subscribe(
      res => {
        this.userDetails = res;
        this.isLoadingUser=false;
        if (this.checkUSer())
        if (this.userIdForCheack.id == id)
          this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    );

  }
  checkSub() {
    if (this.usersub ? !this.usersub.some(e => e.user_Sub == this.userID) : null) {
      this.chke = true;
    }
    else {
      this.chke = false;
    }
    return this.chke;
  }

  checkUSer() {
    if (localStorage.getItem('token') != null) {
      this.chke = true;
    }
    else {
      this.chke = false;
    }
    return this.chke;
  }

  onSubmit() {
    let usersu: subscriptionUser = new subscriptionUser();
    usersu.user_Sub = this.userID;
    usersu.date=new Date();
    this.service.setSub(usersu).subscribe(
      res => {
        if (this.checkSub())
          this.toastr.success('Subscribed successful.');
        else
          this.toastr.warning("Unsubscribed successful.");
        this.ngOnInit();
      },
      err => {
        console.log(err);
        this.toastr.error('Subscription error.');
      }
    );
    this.ngOnInit();
  }


  complainUser() {
    var body = {
      UserId: this.userID,
      Value: this.compModel.value.Value
    };
    this.service.postComplainUser(body).subscribe(
      res => {
        this.compModel.reset();
        this.compCount = 500;
        this.toastr.success("Your complaint is accepted.");
      },
      err => {
        console.log(err);
        this.toastr.error("Try again.", "Error.");
      }
    );
  }


  OnChangeComp() {
    this.compCount = 500 - this.compModel.value.Value.length;
  }

  deleteUserByAdmin(id)
  {
    this.service.deleteUserByAdmin(id).subscribe(res=>
      {
        this.toastr.warning("User has been deleted!");
        this.router.navigate(['/complaints/users']);
      },err=>{console.log(err)});
  }

  saveUserChanges(){
    var body = {
      Id: this.userID,
      UserName: this.userModel.value.userName,
      Name: this.userModel.value.name
    };
    this.service.patchEditUserByAdmin(body).subscribe(
      res => {
        this.userModel.reset();
        this.ngOnInit();
        this.toastr.success("Your changes have been made.");
      },
      err => {
        console.log(err);
        this.toastr.error("Try again.", "Error.");
      }
    );
  }
}
