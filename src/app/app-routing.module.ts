import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { MainPageComponent } from './nonAuth/main-page/main-page.component';
import { AddquestionComponent } from './home/question/addquestion/addquestion.component';
import { ShowquestionComponent } from './home/question/showquestion/showquestion.component';
import { CategoryComponent } from './home/category/category.component';
import { UserListComponent } from './user-list/user-list.component';
import { WaitLoadingComponent } from './wait-loading/wait-loading.component';
import { RecallsComponent } from './recalls/recalls.component';
import { RecallsListComponent } from './recalls/recalls-list/recalls-list.component';
import { ComplaintsComponent } from './administrator/complaints/complaints.component';
import { AnswersComplaintsComponent } from './administrator/complaints/answers-complaints/answers-complaints.component';
import { QuestionsComplaintsComponent } from './administrator/complaints/questions-complaints/questions-complaints.component';
import { UserComplaintsComponent } from './administrator/complaints/user-complaints/user-complaints.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';


const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'user', component: UserComponent,
    children: 
    [
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },
  { path: 'home/question/addquestion', component: AddquestionComponent, canActivate: [AuthGuard] },
  { path: 'userprofile/:id', component: UserprofileComponent },
  { path: 'home/question/showquestion/:id', component: ShowquestionComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'userList', component: UserListComponent },
  { path: 'recallsList/recalls', component: RecallsComponent, canActivate: [AuthGuard] },
  { path: 'recallsList', component: RecallsListComponent },
  { path: 'complaints', component: ComplaintsComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin'] },
    children: 
    [
      { path: 'answers', component: AnswersComplaintsComponent },
      { path: 'questions', component: QuestionsComplaintsComponent },
      { path: 'users', component: UserComplaintsComponent }
    ]
  },
  { path: 'forbidden', component: ForbiddenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
