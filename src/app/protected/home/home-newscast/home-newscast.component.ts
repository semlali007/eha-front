import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { NewsCastService } from 'src/app/core/services/newscast.service';
@Component({
  selector: 'app-home-newscast',
  templateUrl: './home-newscast.component.html',
  styleUrls: ['./home-newscast.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeNewsCastComponent implements OnInit {
  data$: Observable<any>;
  subscription: Subscription;
  list: [];
  constructor(private router: Router,
              private newsCastService: NewsCastService,
              ) { }

  ngOnInit(): void {
    this.loadInformation();
  }


  loadInformation() {
    this.data$ = this.newsCastService.getList({is_home:1});
  }

  navigate(id){
    this.router.navigate([`app/actualites/detail/${id}`]);
  }
  navigateToList(){
    this.router.navigate([`app/actualites`]);
  }

}
