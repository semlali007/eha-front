import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HotlineService } from 'src/app/core/services/hotline.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-hotline-change-informations',
  templateUrl: './hotline-change-informations.component.html',
  styles: [
  ]
})
export class HotlineChangeInformationsComponent implements OnInit {
  hotlineSubscription: Subscription;
  @Output() exported = new EventEmitter<Object>();
  constructor(
    private router: Router,
    private hotlineService: HotlineService,
    ) { }

  ngOnInit(): void {
  }


  createHotline(){
    this.router.navigate(['app/hotline/create']);
  }

  export(){
    this.exported.emit();
  }
  


}
