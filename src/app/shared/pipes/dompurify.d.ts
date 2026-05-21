// Déclaration minimale pour DOMPurify (les @types/dompurify ne sont pas installés).
// On expose uniquement la surface utilisée par SafePipe.
declare module 'dompurify' {
  interface SanitizeOptions {
    ADD_ATTR?: string[];
    ADD_TAGS?: string[];
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
    ALLOW_DATA_ATTR?: boolean;
    USE_PROFILES?: { html?: boolean; svg?: boolean; svgFilters?: boolean; mathMl?: boolean };
    RETURN_DOM?: false;
    RETURN_DOM_FRAGMENT?: false;
    [key: string]: any;
  }

  interface DOMPurifyI {
    sanitize(source: string | Node, options?: SanitizeOptions): string;
    isSupported: boolean;
    version: string;
  }

  const purify: DOMPurifyI;
  export default purify;
}
