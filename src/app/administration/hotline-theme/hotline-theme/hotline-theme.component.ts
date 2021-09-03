import { Component, OnInit } from '@angular/core';
import { HotlineThemeService } from 'src/app/core/services/hotline-theme.service';

@Component({
  selector: 'app-hotline-theme',
  templateUrl: './hotline-theme.component.html',
  styleUrls: ['./hotline-theme.component.css']
})
export class HotlineThemeComponent implements OnInit {
  themes: any = [];
  constructor(
    private hotlineThemeService: HotlineThemeService,
  ) { }

  ngOnInit(): void {
    this.getList();
  }


  getList() {
    this.themes = [];
    this.hotlineThemeService
      .getList({})
      .subscribe(response => {
        this.themes = response.rows;
      })
  }

  update(theme) {
    this.hotlineThemeService
      .update({ id: theme.id })
      .subscribe(response => {
        this.getList();
      })
  }
}
