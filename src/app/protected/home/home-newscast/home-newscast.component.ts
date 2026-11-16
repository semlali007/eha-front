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
  public selected: any = null;

  constructor(private router: Router,
              private newsCastService: NewsCastService,
              ) { }

  ngOnInit(): void {
    this.loadInformation();
  }


  loadInformation() {
    this.data$ = this.newsCastService.getFrontList({is_home:1});
  }

  /** Ouvre l'actualité en plein bloc (détail inline) au lieu de changer de page. */
  open(news: any): void {
    this.selected = news;
    // Charge le message complet (long_description) si absent de la liste.
    if (news && news.id != null && !news.long_description) {
      this.newsCastService.get(news.id).subscribe(data => {
        if (data) { this.selected = data; }
      });
    }
  }

  close(): void {
    this.selected = null;
  }

  navigate(id){
    this.router.navigate([`app/actualites/detail/${id}`]);
  }
  navigateToList(){
    this.router.navigate([`app/actualites`]);
  }

}
