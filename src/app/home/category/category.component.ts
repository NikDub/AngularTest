import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId;
  categoryOne;
  isLoading=true;
  questionByCategory: any;

  constructor( private activateRoute: ActivatedRoute, public service: UserService, private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(({ id }) => { this.isLoading=true;this.loadDate(id);});
  }

  loadDate(id:string)
  {
    this.categoryId = id;
    this.service.getQuestionByCategory(this.categoryId).subscribe(
      res => {
        this.questionByCategory = res;
        this.questionByCategory.forEach(item => {
          item.date = this.service.dateDifference(new Date(item.date), new Date());

          item.ratingCount=0;
          item.answers.forEach(answer => item.ratingCount += answer.ratings.length);

        });
      this.isLoading=false;
    },
      err => {
      console.log(err);
      }
    );
    this.service.getCategoryById(this.categoryId).subscribe(
      res => {
        this.categoryOne = res;
      },
      err => {
        console.log(err);
      }
    );
  }
  

}
