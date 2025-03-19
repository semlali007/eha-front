import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import {  ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { SatisfactionService } from 'src/app/core/services/satisfaction.service';
import { log } from 'console';
@Component({
  selector: 'app-satisfaction',
  templateUrl: './satisfaction.component.html',
  styleUrls: ['./satisfaction.component.css']
})
export class SatisfactionComponent implements OnInit, OnDestroy {
  cockpitId:string='';
  daPGI:string='';
  sub: Subscription;
  disabled :boolean = false;
  warning :boolean = false;
  success :boolean = false;
  postedNni :string = '';
  loginForm: FormGroup;
  public user: User = null;
  public subscription: Subscription;
  protected table0 = ['not_expected', 'complicated', 'good_job', 'special'];
  
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
    this.sub = this.route.params.subscribe(params => {
      if (!!params && !!params.cockpit) {
        this.cockpitId = params.cockpit;
        this.subscription = this.authService.user$.subscribe(user => {
          this.user = user;
          this.satisfactionService.getParticipation({ cockpit_id: this.cockpitId, nni: user.nni })
                                  .subscribe(data=>{
                                    if(!!data && data.nni.length>0){
                                       this.disabled = true;
                                       this.warning = true;
                                       this.loginForm.disable();
                                      this.accompaniement.setValue(this.findValueInTable(data.accompaniement, this.table0));
                                      this.contractual.setValue(this.findValueInTable(data.contractual, this.table0));
                                      this.timing.setValue(this.findValueInTable(data.timing, this.table0));
              
                                       this.strong_points.setValue(data.strong_points);
                                       this.improvement.setValue(data.improvement);
                                       this.postedNni = data.nni
                                    }
                                  });
        }
        );
      }
      if (!!params && !!params.pgi) {
        this.daPGI = params.pgi;
      }
    });
  }
  get accompaniement() { return this.loginForm.get('accompaniement'); }
  get contractual() { return this.loginForm.get('contractual'); }
  get timing() { return this.loginForm.get('timing'); }
  get strong_points() { return this.loginForm.get('strong_points'); }
  get improvement() { return this.loginForm.get('improvement'); }
  navigate(url) {
      this.router.navigate([url]);
  }
  submit(): void {
    const params = {
      cockpit_id: this.cockpitId,
      da_pgi: this.daPGI,
      nni: this.user.nni,
      accompaniement: this.replaceValue(this.accompaniement.value),
      contractual: this.replaceValue(this.contractual.value),
      timing: this.replaceValue(this.timing.value),
      strong_points: this.strong_points.value,
      improvement: this.improvement.value,
    }

    this.satisfactionService.create(params).subscribe(response=>{
      if(!!response){
         this.success = true;
         this.disabled = true;
         this.loginForm.disable();
      }
    });
    this.disabled = true;
  }
  replaceValue(value: number): string {
    if (!isNaN(value) && value >= 1 && value <= this.table0.length) {
        return this.table0[value - 1];
    } else {
        return value.toString();
    }
  }
  
  private findValueInTable(value: string, table: string[]): number {
    return table.indexOf(value) + 1;
  }
  
  changeStarColor(type: string,value: number) {

    if(type =='accompaniement'){
      this.accompaniement.setValue(value);
    } else if(type== 'contractual'){
      this.contractual.setValue(value);
    }else{
      this.timing.setValue(value);
    }
  }
  
 
  ngOnDestroy() {
    this.sub.unsubscribe();
   }

}



