import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Observable } from 'rxjs';
import { timer } from 'rxjs';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  public isLoading$: Observable<boolean>;
  public timer$: Observable<any>;
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.isLoading$ = this.loaderService.isLoading$;
  }

}
