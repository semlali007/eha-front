import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}
 
 public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl | string | null {
    switch (type) {
			case 'html':
				// Assainir le HTML au lieu de bypasser la sécurité Angular.
				// Cela conserve le formatage (gras, italique, listes, etc.)
				// mais supprime les scripts, event handlers (onclick, onerror, etc.)
				// et les attributs dangereux pour prévenir les XSS.
				return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
			case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
			case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
			case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
			case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
			default: throw new Error(`Invalid safe type specified: ${type}`);
		}
  }
}