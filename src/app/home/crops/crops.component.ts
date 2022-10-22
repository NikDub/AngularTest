import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-crops',
  templateUrl: './crops.component.html',
  styleUrls: ['./crops.component.scss']
})
export class CropsComponent implements OnInit {
  userWithCrops;
  isLoading:boolean=true;

  constructor(private router: Router, public service: UserService) { }

  ngOnInit(): void {
    this.service.getSubCrops().subscribe(
      res => {
        this.userWithCrops = res;
        this.isLoading=false;
      },
      err => {
        console.log(err);
      }
    );
  }

  getprofil(id: string) {
    this.router.navigate(['/userprofile/' + id]);
  }

}
