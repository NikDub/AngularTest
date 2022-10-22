import { Injectable } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { subscriptionUser } from './model/subscriptionUser';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService
{
  constructor( private http: HttpClient) { }

  readonly BaseURI = "http://localhost:5077/api";
  formModel:any;

  dateDifference(date1: Date, date2: Date) {

    let delta = Math.floor((+date2 - +date1) / 1000)- 10800;
    let week = Math.floor(delta / (86400 * 7));
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = delta % 60;
    let dateStr;
    if (week != 0)
      dateStr = `${week} weeks`;
    else if (days != 0)
      dateStr = ` ${days} days`;
    else if (hours != 0)
      dateStr = `${hours} hours`;
    else if (minutes != 0)
      dateStr = `${minutes} minutes`;
    else 
      dateStr='<1 minute';
  
    return dateStr;
  }
  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
  roleMatchAdmin(): boolean {
    var allowedRoles = ['Admin'];
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
  checkUSer(){
    if (localStorage.getItem('token') != null)
      return true;
    else 
      return false;
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
  patchEditUser(body){
    return this.http.patch(this.BaseURI+"/AppUser/EditUser", body);
  }

  getUSerId()
  {
    return this.http.get(this.BaseURI+ "/UserProfile/GetUserId/");
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
  UploadeImage( uploadForm: FormGroup){
    return this.http.post(this.BaseURI + '/Image/Upload', uploadForm, { reportProgress: true, observe: 'events'});
  }



  getSubCrops(){
    return this.http.get(this.BaseURI + '/Subscription/CropsSub');
  }
  getSubCropsById(id:string){
    return this.http.get(this.BaseURI + '/Subscription/CropsSubById/'+ id);
  }
  getMySubscib(){
    return this.http.get<subscriptionUser[]>(this.BaseURI+'/Subscription/getsublist');
  }
  setSub(sub: subscriptionUser) {
    return this.http.post(this.BaseURI+'/Subscription/sub', sub);
  }



  getQuestionWithAnswer(){
    return this.http.get(this.BaseURI+'/Questions/getquestionswithanswer');
  }
  getQuestionUserById(id: string)
  {
    return this.http.get(this.BaseURI+'/Questions/'+id);
  }
  deleteQuestion(id:string)
  {
    return this.http.delete(this.BaseURI+'/Questions/Delete/'+id);
  }
  getQuestionById(Userid: string){
    return this.http.get(this.BaseURI+'/Questions/ById/'+Userid);
  }
  addQuestion( uploadForm: FormGroup){
    return this.http.post(this.BaseURI + '/Questions/AddQuestion', uploadForm);
  }
  getLastQuestion()
  {
    return this.http.get(this.BaseURI+ '/Questions/GetLastQuestion/');
  }



  GetAnswerByQuestionId(id: string)
  {
    return this.http.get(this.BaseURI+'/Answer/'+id);
  }
  deleteAnswer(id:string)
  {
    return this.http.delete(this.BaseURI+'/Answer/Delete/'+id);
  }
  addAnswer( uploadForm: FormGroup){
    return this.http.post(this.BaseURI + '/Answer/AddAnswer', uploadForm);
  }
  getLastAnswer()
  {
    return this.http.get(this.BaseURI+ '/Answer/GetLastAnswer/');
  }
  getAnswerCountById(id: string){
    return this,this.http.get(this.BaseURI + '/Answer/Count/'+ id);
  }


  getCategory(){
    return this.http.get(this.BaseURI+'/Category/GetCategory');
  }
  getCategoryById(id: string){
    return this.http.get(this.BaseURI+'/Category/CategoryById/'+id);
  }
  getQuestionByCategory(id: string){
    return this.http.get(this.BaseURI+'/Category/ByCategory/'+id);
  }



  searchQuestion(term: string){

    if(!term.trim()){
      return of([]);
    }

    return this.http.get(this.BaseURI+ '/Search/SearchByQuestion/'+term).pipe();
  }
  searchUser(term: string){

    if(!term.trim()){
      return of([]);
    }

    return this.http.get(this.BaseURI+ '/Search/SearchByUser/'+term).pipe();
  }

  
 
  postRatingById(id: string){
    var body = {
      Id: id
    };
    return this.http.post(this.BaseURI + '/Ratings/', body);
  }
  postDownloadFile(id: string){
    var body = {
      Id: id
    };
    return this.http.post(this.BaseURI + '/Image/Download/', body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }
  getRatingList(){
    return this.http.get(this.BaseURI+"/Ratings/");
  }


  postComplainAnswer(body)
  {
    return this.http.post(this.BaseURI+'/Complaints/SetAnswer/', body);
  }
  getComplainAnswer()
  {
    return this.http.get(this.BaseURI +'/Complaints/GetComplainsAnswer');
  }
  postComplainQuestion(body)
  {
    return this.http.post(this.BaseURI+'/Complaints/SetQuestion/', body);
  }
  getComplainQuestion()
  {
    return this.http.get(this.BaseURI +'/Complaints/GetComplainsQuestion');
  }
  postComplainUser(body)
  {
    return this.http.post(this.BaseURI+'/Complaints/SetUser/', body);
  }
  getComplainUser()
  {
    return this.http.get(this.BaseURI +'/Complaints/GetComplainsUser');
  }
  postComplainSeenById(id: string){
    var body = {
      Id: id
    };
    return this.http.post(this.BaseURI + '/Complaints/ById/', body);
  }



  postRecalls(body){
    return this.http.post(this.BaseURI+ "/Recalls/Set", body);
  }
  getRecalls(){
    return this.http.get(this.BaseURI+ "/Recalls");
  }
  deleteRecalls(id:string)
  {
    return this.http.delete(this.BaseURI+'/Recalls/Delete/'+id);
  }



  getNotificationAnswer(){
    return this.http.get(this.BaseURI+"/Notifications/GetAnswers/");
  }
  getNotificationRating(){
    return this.http.get(this.BaseURI+"/Notifications/GetRating/");
  }
  getNotificationSub(){
    return this.http.get(this.BaseURI+"/Notifications/GetSub/");
  }
  getNotificationQuestion()
  {
    return this.http.get(this.BaseURI+"/Notifications/GetQuestion/");
  }

  
  getSeen()
  {
     return this.http.get(this.BaseURI + '/Notifications/GetSeen/');
  }



  deleteUserByAdmin(id){
    return this.http.delete(this.BaseURI+'/Admin/DeleteUserByAdmin/'+id);
  }
  deleteAnswerByAdmin(id){
    return this.http.delete(this.BaseURI+'/Admin/DeleteAnswerByAdmin/'+id);
  }
  deleteQuestionByAdmin(id){
    return this.http.delete(this.BaseURI+'/Admin/DeleteQuestionByAdmin/'+id);
  }

  patchEditUserByAdmin(body){
    return this.http.patch(this.BaseURI+"/Admin/EditUser", body);
  }

}
