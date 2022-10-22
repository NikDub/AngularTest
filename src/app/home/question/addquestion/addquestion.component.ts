import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Question } from 'src/app/shared/model/File';
import { from } from 'rxjs';
import { QuestionAndAnswer } from 'src/app/shared/model/QuestionAndAnswer';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addquestion',
  templateUrl: './addquestion.component.html',
  styleUrls: ['./addquestion.component.scss']
})
export class AddquestionComponent implements OnInit {

  constructor(public service: UserService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) { }
  files: any[] = [];
  categorylist: any;

  questModel = this.fb.group({
    Head: ['', Validators.compose([Validators.required, Validators.maxLength(100)]) ],
    Value: ['', Validators.maxLength(3000)],
    Category: ['', Validators.required]
  });

  headCount:Number = 100;
  textCount:Number = 3000;
  ngOnInit(): void {
    this.service.getCategory().subscribe(
      res => {
        this.categorylist = res;
      },
      err => {
        console.log(err);
      }
    );
  }
  OnChangeHead(){
    this.headCount=100-this.questModel.value.Head.length;
  }
  OnChangeText(){
    this.textCount=3000-this.questModel.value.Value.length;
  }
  onFileDropped($event) {
    this.prepareFilesList($event);
  }
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  prepareFilesList(filesArr: Array<any>) {
    if(filesArr.length+ this.files.length>5){
      alert("You can't add more 5 files.");
      return;
    }
    for (const item of filesArr) {
      this.files.push(item);
    }
  }

  onSubmit() {
    let fromadata:any = new FormData();
    let questionForm: Question = new Question;
    
    questionForm.date=new Date();
    questionForm.head=this.questModel.value.Head;
    questionForm.value=this.questModel.value.Value;
    questionForm.category=this.questModel.value.Category;
   
 

    for (let i = 0; i < this.files.length; i++) 
    {
      fromadata.append('files', this.files[i]);
    }
    fromadata.append('data',JSON.stringify(questionForm));

    this.service.addQuestion(fromadata).subscribe(
      (res: any) => {
        this.toastr.success("Question has been successfully added.");
        this.router.navigate(['/home/question/showquestion/' + res.id]);
      },
      err => {
        console.log(err);
      }
    );
  }

}
