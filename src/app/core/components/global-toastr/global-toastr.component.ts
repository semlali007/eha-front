import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { Observable } from 'rxjs';
import { Toastr } from 'src/app/shared/models/toastr';

@Component({
  selector: 'app-global-toastr',
  templateUrl: './global-toastr.component.html',
  styleUrls: ['./global-toastr.component.css']
})
export class GlobalToastrComponent implements OnInit {
 
  public globalToastr$: Observable<Toastr|null>;
  
  constructor(private toastrService: ToastrService) { }
  
  ngOnInit() {
   this.globalToastr$ = this.toastrService.globalToastr$;
  }

  closeToastr() {
    this.toastrService.closeGlobalToastr();
   }
 }

