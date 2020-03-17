import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { HttpClient } from "@angular/common/http"
import { QuestionAndAnswer } from '../QuestionAndAnswer';
import { Router } from '@angular/router';
import { subscriptionUser } from '../home/subscriptionUser';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  someValueExpression: File = null;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,  public toastr: ToastrService) { }
  readonly BaseURI = "http://localhost:5077";

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Name: [''],
    Email: ['', Validators.email],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })
  })

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }


  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      Name: this.formModel.value.Name,
      Password: this.formModel.value.Passwords.Password
    };

    return this.http.post(this.BaseURI + '/AppUser/Register', body);
  }

  login(formData: FormsModule) {
    return this.http.post(this.BaseURI + '/AppUser/Login', formData);
  }

  UploadeImage( uploadForm: FormGroup){
    return this.http.post(this.BaseURI + '/Image/Upload', uploadForm, {reportProgress: true, observe: 'events'});
  }

  
  getUserProfile() {
    return this.http.get(this.BaseURI + '/UserProfile');
  }

  getUserProfileByID(id: string){
    return this.http.get(this.BaseURI + '/UserProfile/'+id);
  }

  getUsersWithCrops(){
    return this.http.get(this.BaseURI + '/Image/GetCrops');
  }

  getQuestionWithAnswer(){
    return this.http.get(this.BaseURI+'/Questions/getquestionswithanswer');
  }

  getQuestionWithAnswerById(id: string){
    return this.http.get(this.BaseURI+'/Questions/getquestionswithanswer/'+id);
  }

  getQuestionWithOutAnswer(){
    return this.http.get<QuestionAndAnswer[]>(this.BaseURI+'/Questions/getquestions');
  }

  setQuestion(qanda){
    return this.http.post(this.BaseURI+'/Questions/AddQuestion',qanda);
  }

  setAnswer(qanda: QuestionAndAnswer) {

    return this.http.put(this.BaseURI+'/Questions/AddAnswer', qanda);
  }

  getMySubscib(){
    return this.http.get<subscriptionUser[]>(this.BaseURI+'/Subscription');
  }

  setSub(sub: subscriptionUser) {

    return this.http.post(this.BaseURI+'/Subscription/sub', sub);
  }
}
