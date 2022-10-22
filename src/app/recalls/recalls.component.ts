import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recalls',
  templateUrl: './recalls.component.html',
  styleUrls: ['./recalls.component.scss']
})
export class RecallsComponent implements OnInit {

  recallModel = this.fb.group({
    Head: ['', Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(20)])],
    Value: ['', Validators.maxLength(300)],
  });

  headCount: Number = 100;
  textCount: Number = 300;

  constructor( private router: Router, private fb: FormBuilder, public service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void { }


  OnChangeHead() {
    this.headCount = 100 - this.recallModel.value.Head.length;
  }
  OnChangeText() {
    this.textCount = 300 - this.recallModel.value.Value.length;
  }


  onSubmit() {
    var body = {
      Head: this.recallModel.value.Head,
      Value: this.recallModel.value.Value,
    };

    this.service.postRecalls(body).subscribe(
      res => {
        this.toastr.success("Recall has been successfully added.");
        this.router.navigate(['/recallsList']);
      },
      err => {
        console.log(err);
      });
  }
}
