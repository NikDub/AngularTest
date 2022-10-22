import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserService } from './shared/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { MainPageComponent } from './nonAuth/main-page/main-page.component';
import { MainHeadComponent } from './nonAuth/main-head/main-head.component';
import { QuestionComponent } from './home/question/question.component';
import { ProfileComponent } from './home/profile/profile.component';
import { CropsComponent } from './home/crops/crops.component';
import { AddquestionComponent } from './home/question/addquestion/addquestion.component';
import { DndDirective } from './dnd.directive';
import { ProgressComponent } from './progress/progress.component';
import { ShowquestionComponent } from './home/question/showquestion/showquestion.component';
import { QuestionuserprofilComponent } from './userprofile/questionuserprofil/questionuserprofil.component';
import { CategoryComponent } from './home/category/category.component';
import { UserListComponent } from './user-list/user-list.component';
import { WaitLoadingComponent } from './wait-loading/wait-loading.component';
import { SubUsersComponent } from './userprofile/sub-users/sub-users.component';
import { RecallsComponent } from './recalls/recalls.component';
import { RecallsListComponent } from './recalls/recalls-list/recalls-list.component';
import { ComplaintsComponent } from './administrator/complaints/complaints.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { UserComplaintsComponent } from './administrator/complaints/user-complaints/user-complaints.component';
import { AnswersComplaintsComponent } from './administrator/complaints/answers-complaints/answers-complaints.component';
import { QuestionsComplaintsComponent } from './administrator/complaints/questions-complaints/questions-complaints.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    UserprofileComponent,
    MainPageComponent,
    MainHeadComponent,
    QuestionComponent,
    ProfileComponent,
    CropsComponent,
    AddquestionComponent,
    DndDirective,
    ProgressComponent,
    ShowquestionComponent,
    QuestionuserprofilComponent,
    CategoryComponent,
    UserListComponent,
    WaitLoadingComponent,
    SubUsersComponent,
    RecallsComponent,
    RecallsListComponent,
    ComplaintsComponent,
    AdministratorComponent,
    UserComplaintsComponent,
    AnswersComplaintsComponent,
    QuestionsComplaintsComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-custom',
      progressBar: true
    }),
    FormsModule
  ],
  providers: [UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
