import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import {  ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { SatisfactionService } from 'src/app/core/services/satisfaction.service';
@Component({
  selector: 'app-satisfaction',
  templateUrl: './satisfaction.component.html',
})
export class SatisfactionComponent implements OnInit, OnDestroy {
  cockpitId:string='';
  daPGI:string='';
  sub: Subscription;
  disabled :boolean = false;
  warning :boolean = false;
  success :boolean = false;
  loginForm: FormGroup;
  public user: User = null;
  public subscription: Subscription;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder, 
    private router: Router, 
    private satisfactionService: SatisfactionService,
  ) {
  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      'accompaniement': ['', [
        Validators.required,
      ]],
      'contractual': ['', [
        Validators.required,
      ]],
      'timing': ['', [
        Validators.required,
      ]],
      'strong_points': [''],
      'improvement': ['']
    });
    this.sub = this.route.queryParams.subscribe(params => {
      if (!!params && !!params.cockpit_id) {
        this.cockpitId = params.cockpit_id;
        this.subscription = this.authService.user$.subscribe(user => {
          this.user = user;
          this.satisfactionService.getParticipation({ cockpit_id: this.cockpitId, nni: user.nni })
                                  .subscribe(data=>{
                                    if(!!data && data.nni.length>0){
                                       this.disabled = true;
                                       this.warning = true;
                                    }
                                       
                                  });
        }
        );
      }
      if (!!params && !!params.da_pgi) {
        this.daPGI = params.da_pgi;
      }
    });
  }
  get accompaniement() { return this.loginForm.get('accompaniement'); }
  get contractual() { return this.loginForm.get('contractual'); }
  get timing() { return this.loginForm.get('timing'); }
  get strong_points() { return this.loginForm.get('strong_points'); }
  get improvement() { return this.loginForm.get('improvement'); }

  submit(): void {
    const params = {
      cockpit_id: this.cockpitId,
      da_pgi: this.daPGI,
      nni: this.user.nni,
      accompaniement: this.accompaniement.value,
      contractual: this.contractual.value,
      timing: this.timing.value,
      strong_points: this.strong_points.value,
      improvement: this.improvement.value,
    }
    this.satisfactionService.create(params).subscribe(response=>{
      if(!!response){
         this.success = true;
         this.disabled = true;
      }
    });

  }
 
  ngOnDestroy() {
    this.sub.unsubscribe();
   }

}



