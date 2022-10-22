import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recalls-list',
  templateUrl: './recalls-list.component.html',
  styleUrls: ['./recalls-list.component.scss']
})
export class RecallsListComponent implements OnInit {

  isLoading=true;
  isLoadingUser=true;
  recallsList:any;
  userDetails:any;
  constructor(private router: Router, private fb: FormBuilder, public service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadingRecalls();

    if (this.checkUSer()) {
      this.service.getUserProfile().subscribe(
        res => {
          this.userDetails = res;
          this.isLoadingUser = false;
        },
        err => {
          console.log(err);
        }
      );
    }
    else {
      this.isLoadingUser = false;
    }
  }

  loadingRecalls(){
    this.service.getRecalls().subscribe(res=>{
      this.recallsList=res; 
      this.isLoading=false;
    },
    err=>{console.log(err)});

  }
  
  checkUSer() {
    if (localStorage.getItem('token') != null)
      return true;
    else
      return false;
  }

  recallsSettings(userId: string)
  {
    if(this.userDetails?.id==userId)
    {
      return true;
    }
    else
      return false;
  }


  recallsDelete(id:string)
  {
      this.service.deleteRecalls(id).subscribe(
      res => {
        this.loadingRecalls();
        this.toastr.success("Wait some time.","You recalls has been deleted.");
    },
      err => {
        console.log(err);
        this.toastr.error("Try again.","Delete error.");
      }
    );
  }
}
