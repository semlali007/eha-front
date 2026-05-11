import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}

  public transform(value: any, type: 'html' = 'html'): string {
    if (type !== 'html') {
      throw new Error(`Invalid safe type specified: ${type}. Only 'html' is supported.`);
    }
    // Assainir le HTML au lieu de bypasser la sécurité Angular.
    // Cela conserve le formatage (gras, italique, listes, etc.) mais supprime les scripts,
    // event handlers (onclick, onerror, etc.) et les attributs dangereux pour prévenir les XSS.
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }
}
