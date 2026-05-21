import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

export type SafeType = 'html' | 'rich-html';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}

  public transform(value: any, type: SafeType = 'html'): SafeHtml | string {
    if (value == null) return '';

    if (type === 'html') {
      // Assainir le HTML via Angular : conserve gras/italique/listes/liens
      // mais supprime scripts, event handlers (onclick, …) ET les styles inline.
      // Utiliser ce mode pour les contenus simples où la mise en forme typographique
      // suffit (descriptions courtes, libellés enrichis…).
      return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
    }

    if (type === 'rich-html') {
      // Assainir via DOMPurify en conservant l'attribut style inline (text-align,
      // text-decoration, color, font-size, …). DOMPurify analyse les valeurs CSS
      // et rejette les patterns dangereux (expression(), url(javascript:…), etc.).
      // À utiliser pour du contenu rédigé via TinyMCE où la mise en forme riche est
      // attendue. Le résultat est marqué trusted car DOMPurify a déjà sanitizé —
      // sans bypass, Angular re-strip l'attribut style.
      const clean = DOMPurify.sanitize(String(value), {
        ADD_ATTR: ['style', 'target'],
        FORBID_TAGS: ['style', 'script'],
        ALLOW_DATA_ATTR: false,
      });
      return this.sanitizer.bypassSecurityTrustHtml(clean);
    }

    throw new Error(`Invalid safe type specified: ${type}. Allowed: 'html', 'rich-html'.`);
  }
}
