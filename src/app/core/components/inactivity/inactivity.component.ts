import { Component, ApplicationRef } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppConfigService } from 'src/app/core/services/app-config.service';

@Component({
  selector: 'app-inactivity',
  template: '',
})
export class InactivityComponent {

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private appRef: ApplicationRef,
    private toastrService: ToastrService,
    private authService: AuthService,
    private config: AppConfigService,
  ) {
    idle.setIdle(config.appConfig.userInactivity || 1800);
    idle.setTimeout(config.appConfig.userTimeout || 300);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idle.onIdleEnd.subscribe(() => {
      this.toastrService.closeGlobalToastr();
      this.appRef.tick();
    });
    idle.onTimeout.subscribe(() => {
      this.authService.revokeTokenAndLogout();
    });
    idle.onIdleStart.subscribe(
      () => {
      }
    );

    idle.onTimeoutWarning.subscribe((countdown) => {
      var minutes = Math.floor(countdown / 60);
      var secondes = countdown - (minutes * 60);
      this.toastrService.showGlobalToastr(
        {
          category: 'danger',
          message: `Votre session va bientôt expirer. Voulez-vous poursuivre votre navigation ? Sans action de votre part, vous serez déconnecté dans ${minutes} minutes et ${secondes} secondes.`
        }
      )
    }

    );

    keepalive.interval(15);
    keepalive.onPing.subscribe(() => {
    });

    this.reset();
  }

  reset() {
    this.idle.watch();
  }
}