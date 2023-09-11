import { Injectable } from '@angular/core';
import { ToastrService } from './toastr.service';
@Injectable({
  providedIn: 'root'
})
export class Browser {
  static readonly FIREFOX = 'firefox' ; // Firefox
  static readonly EDGE = 'edge' ; // EDGE
  static readonly CHROME = 'chrome' ; // Chrome 
  static readonly IE = 'ie' ; // Internet explorer
  static readonly OPERA = 'opera' ; // Opera
  static readonly SAFARI = 'safari' ; // Safari
  static readonly OTHER = 'other' ; // Safari

  constructor(private toastrService: ToastrService)
  { }

    /**
     * Detect Browser name
     */
    detectName(){ 
        const agent = window.navigator.userAgent.toLowerCase()
        switch (true) {
          case agent.indexOf('edge') > -1:
            return Browser.EDGE;
          case agent.indexOf('opr') > -1 && !!(<any>window).opr:
            return Browser.OPERA;
          case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
            return Browser.CHROME;
          case agent.indexOf('trident') > -1:
            return Browser.IE;
          case agent.indexOf('firefox') > -1:
            return Browser.FIREFOX;
          case agent.indexOf('safari') > -1:
            return Browser.SAFARI;
          default:
            return Browser.OTHER ;
        }
      }

      public checkIfFirefox() {
          var browsername = this.detectName() ;
          localStorage.setItem('checkbrowser',browsername);
          if(browsername !== Browser.EDGE){
            this.toastrService.showGlobalToastr({
              category: 'danger',
              message: ""
              // Le navigateur EDGE est recommandé pour une navigation optimale.
            });
          }
      }
        
    }