import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {  ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-inactivity',
  templateUrl: './inactivity.component.html',
  styleUrls: ['./inactivity.component.css']
})
export class InactivityComponent implements OnInit {
  // some fields to store our state so we can display it in the UI
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;
  modalRef?: BsModalRef;
  message?: string;
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  isModalShown = false;
 

  // add parameters for Idle and Keepalive (if using) so Angular will inject them from the module
  constructor(private idle: Idle, keepalive: Keepalive, 
    cd: ChangeDetectorRef,
     private modalService: BsModalService,
     private authService: AuthService,
     ) {
    // set idle parameters
    idle.setIdle(5); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(20); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      console.log('onIdleStart');
      this.idleState = "IDLE";
      this.showModal();
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      //   if(this.isModalShown == false){
      this.idleState = "NOT_IDLE";
      console.log(`${this.idleState} ${new Date()}`)
      this.countdown = null;
      cd.detectChanges(); 
      // }
      console.log('onIdleEnd');

    });
    // do something when the user has timed out
    idle.onTimeout.subscribe(() => 
    {
      this.idleState = "TIMED_OUT";
      console.log('onTimeout');
     // this.authService.revokeTokenAndLogout();
    });
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => 
      {
        this.countdown = seconds;
        console.log('onTimeoutWarning');
      });

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => {
     // if(this.isModalShown == false){
      this.lastPing = new Date();
     // }
      console.log('onPing');

    }); // do something when it pings
  }

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
    console.log('reset');
  }

  ngOnInit(): void {
    // right when the component initializes, start reset state and start watching
    console.log('ngOnInit');
    this.reset();
  }
 
  confirm(): void {
    console.log("confirm");
    this.hideModal();
    this.reset();
  }
 
  decline(): void {
    console.log("decline");
    this.hideModal();
    this.authService.revokeTokenAndLogout();
  }

  showModal(): void {
    console.log("show");
    this.idle.clearInterrupts();
    this.isModalShown = true;
  }
 
  hideModal(): void {
    console.log("hide");
    this.autoShownModal?.hide();
  }
 
  onHidden(): void {
    console.log("onhide");
    this.isModalShown = false;
  }
  
}
  