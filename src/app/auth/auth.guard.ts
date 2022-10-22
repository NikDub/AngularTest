import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private toastr: ToastrService, private service: UserService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('token') != null)
    {
      var roles = next.data['permittedRoles'] as Array<string>;
      if(roles){
        if(this.service.roleMatch([roles])) return true;
        else 
        {
          this.router.navigate(['/forbidden']);
          return false;
        }
      }
      return true;
    }
    else {
      this.toastr.error('You must register or log in.', 'Authentication failed.');
      this.router.navigate(['/user/login']);
      return false;
    }

  }
}
