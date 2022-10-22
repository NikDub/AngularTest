import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Answers } from 'src/app/shared/model/Answer';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-showquestion',
  templateUrl: './showquestion.component.html',
  styleUrls: ['./showquestion.component.scss']
})
export class ShowquestionComponent implements OnInit {
  compAnswer;

  questionId;
  questionDetails: any;
  answerDetails: any;
  userDetails: any;
  isLoadingUser: boolean = true;
  isLoadingQuest: boolean = true;
  isLoadingAnswers: boolean = true;
  files: any[] = [];
  answerModel = this.fb.group({
    Value: ['', Validators.compose([Validators.required, Validators.maxLength(3000)])]
  });

  compModel = this.fb.group({
    Value: ['', Validators.compose([Validators.required, Validators.maxLength(500)])]
  });

  textCount: Number = 3000;
  compCount: Number = 500;

  constructor(public service: UserService, private activateRoute: ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService, private router: Router) { }


  ngOnInit(): void {
    this.questionId = this.activateRoute.snapshot.params['id'];
    this.loadingAnswers();

    this.service.getQuestionUserById(this.questionId).subscribe(
      res => {
        this.questionDetails = res;
        this.questionDetails.date = this.service.dateDifference(new Date(this.questionDetails.date), new Date());

        this.isLoadingQuest = false;
      },
      err => {
        console.log(err);
      }
    );

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

  loadingAnswers() {
    this.service.GetAnswerByQuestionId(this.questionId).subscribe(
      res => {
        this.answerDetails = res;
        this.answerDetails.forEach(item => {
          item.date = this.service.dateDifference(new Date(item.date), new Date());
        });
        this.isLoadingAnswers = false;
      },
      err => {
        console.log(err);
        this.isLoadingAnswers = false;
      }
    );
  }

  OnChangeText() {
    this.textCount = 3000 - this.answerModel.value.Value.length;
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
    if (filesArr.length + this.files.length > 5) {
      alert("You can't add more 5 files.");
      return;
    }
    for (const item of filesArr) {
      this.files.push(item);
    }
  }


  downloadFile(id: string, filename: string) {
    console.log(id);
    this.service.postDownloadFile(id).subscribe(
      res => {
        saveAs(res, filename);
      },
      err => {
        console.log(err);
      }
    );
  }
  onSubmit() {
    let fromadata: any = new FormData();
    let answerForm: Answers = new Answers;
    answerForm.date = new Date();
    answerForm.value = this.answerModel.value.Value;
    answerForm.questionid = this.questionId;
    console.log(answerForm);
    console.log(this.files);
    for (let i = 0; i < this.files.length; i++) {
      fromadata.append('files', this.files[i]);
    }
    fromadata.append('data', JSON.stringify(answerForm));

    this.service.addAnswer(fromadata).subscribe(
      (res: any) => {
        console.log(res);
        this.loadingAnswers();
        this.answerModel.reset();
        this.files = [];
        this.toastr.success("Your answer has been successfully added.");
      },
      err => {
        console.log(err);
        this.toastr.error("Try again.", "Error adding response.");
      }
    );
  }

  setRatingById(id: string) {
    this.service.postRatingById(id).subscribe(
      res => {
        return res;
      },
      err => {
        console.log(err);
      }
    );
  }

  cheack(ratings) {
    var all = ratings.find(e => e.userId == this.userDetails.id)
    if (all)
      return true;
    else
      return false;
  }

  checkUSer() {
    if (localStorage.getItem('token') != null)
      return true;
    else
      return false;
  }

  answerSettings(userId: string) {
    if (this.userDetails.id == userId)
      return true;
    else
      return false;
  }

  deleteAnswer(id: string) {
    this.service.deleteAnswer(id).subscribe(
      res => {
        this.loadingAnswers();
        this.toastr.success("Wait some time.", "You answer has been deleted.");
      },
      err => {
        console.log(err);
        this.toastr.error("Try again.", "Delete error.");
      }
    );
  }

  complainAnswer() {
    var body = {
      AnswerId: this.compAnswer,
      Value: this.compModel.value.Value
    };
    this.service.postComplainAnswer(body).subscribe(
      res => {
        this.compModel.reset();
        this.compCount = 500;
        this.compAnswer = null;
        this.toastr.success("Your complaint is accepted.");
      },
      err => {
        console.log(err);
        this.toastr.error("Try again.", "Error.");
      }
    );
  }

  complainQuestion() {
    var body = {
      QuestionId: this.compAnswer,
      Value: this.compModel.value.Value
    };
    this.service.postComplainQuestion(body).subscribe(
      res => {
        this.compModel.reset();
        this.compCount = 500;
        this.compAnswer = null;
        this.toastr.success("Your complaint is accepted.");
      },
      err => {
        console.log(err);
        this.toastr.error("Try again.", "Error.");
      }
    );
  }

  setCompl(id) {
    this.compAnswer = id;
  }

  OnChangeComp() {
    this.compCount = 500 - this.compModel.value.Value.length;
  }

  deleteQuestionByAdmin(id)
  {
    this.service.deleteQuestionByAdmin(id).subscribe(res=>
      {
        this.toastr.warning("Question has been deleted!");
        this.router.navigate(['/complaints/questions']);
      },err=>{console.log(err)});
  }

  deleteAnswerByAdmin(id)
  {
    this.service.deleteAnswerByAdmin(id).subscribe(res=>
      {
        this.toastr.warning("Answer has been deleted!");
        this.loadingAnswers();
      },err=>{console.log(err)});
  }
  
}
