import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  userDetails;
  uploadForm: FormGroup;
  isLoading:boolean=true;

  userModel = this.formBuilder.group({
    userName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])]
  });

  constructor( public service: UserService,  private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      image: [null]
    });
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      this.isLoading=false;
      },
      err => {
        console.log(err);
      }
    );
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.uploadForm.patchValue({ image: event.target.files[0] });;
      this.uploadForm.get('image').updateValueAndValidity();
    }
  }

  onSubmit() {
    var fromadata: any = new FormData();
    fromadata.append("image", this.uploadForm.get("image").value);
    this.service.UploadeImage(fromadata).subscribe(
      res => { this.ngOnInit(); },
      err => { console.log(err); });
  }


  saveUserChanges(){
    var body = {
      Id: this.userDetails.Id,
      UserName: this.userModel.value.userName,
      Name: this.userModel.value.name
    };
    this.service.patchEditUser(body).subscribe(
      res => {
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
