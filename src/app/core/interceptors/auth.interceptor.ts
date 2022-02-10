import { Observable, of } from 'rxjs';
import { Injectable, Inject, Optional } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authStorage: OAuthStorage,
    private appConfigService: AppConfigService,
  ) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     if(req.url.includes('.well-known/openid-configuration')){
      let body ={
        "response_types_supported": [
            "code token id_token",
            "code",
            "code id_token",
            "id_token",
            "code token",
            "token",
            "token id_token"
        ],
        "claims_parameter_supported": true,
        "introspection_endpoint": `${this.appConfigService.authConfig.issuer}/introspect`,
        "end_session_endpoint": `${this.appConfigService.authConfig.issuer}/connect/endSession`,
        "version": "3.0",
        "check_session_iframe": `${this.appConfigService.authConfig.issuer}/connect/checkSession`,
        "scopes_supported": [
            "gardianTypeUtilisateur",
            "address",
            "gardianSesameProfil",
            "gardianSesameDroit",
            "openid",
            "profile",
            "noportissuer",
            "givenName",
            "gardianGroupID",
            "gardianDonneesEnrichies1",
            "gardianDonneesEnrichies2",
            "gardianDonneesEnrichies3",
            "gardianDonneesEnrichies4",
            "gardianDonneesEnrichies5",
            "uid",
            "gardianHierarchie",
            "employeeType",
            "phone",
            "departmentNumber",
            "gardianProfil",
            "businessCategory",
            "isMemberOf",
            "email"
        ],
        "issuer": `${this.appConfigService.authConfig.issuer}`,
        "id_token_encryption_enc_values_supported": [],
        "acr_values_supported": [
            "gardianGROUPE",
            "sesameENEDIS",
            "sesameEDF",
            "gardianEDF",
            "gardianENEDIS",
            "sesameGROUPE"
        ],
        "authorization_endpoint": `${this.appConfigService.authConfig.issuer}/authorize`,
        "userinfo_endpoint": `${this.appConfigService.authConfig.issuer}/userinfo`,
        "claims_supported": [
            "acr",
            "zoneinfo",
            "address",
            "noportissuer",
            "profile",
            "name",
            "phone_number",
            "locale",
            "given_name",
            "family_name",
            "email"
        ],
        "id_token_encryption_alg_values_supported": [
            "RSA1_5"
        ],
        "jwks_uri": `${this.appConfigService.authConfig.issuer}/connect/jwk_uri`,
        "subject_types_supported": [
            "public"
        ],
        "id_token_signing_alg_values_supported": [
            "RS256"
        ],
        "registration_endpoint": `${this.appConfigService.authConfig.issuer}/connect/register`,
        "token_endpoint_auth_methods_supported": [
            "client_secret_post",
            "private_key_jwt",
            "client_secret_basic"
        ],
        "token_endpoint": `${this.appConfigService.authConfig.issuer}/access_token`
    }
    let cachedResponse: HttpResponse<any> = new HttpResponse({'body':body});
      return of(cachedResponse);
    }

    if (!this.isMedia(req.url) && req.method !== "GET") {
      req = this.addContentType(req);
    }

    if (!this.isPublicRequest(req.url)) {
      const token = this.authStorage.getItem('id_token');
      const accessToken = this.authStorage.getItem('access_token');
      const header = 'Bearer ' + token + ' ' + accessToken;
      const headers = req.headers
        .set('Authorization', header);
      req = req.clone({ headers });
    }

    return next.handle(req);
  }

  private addContentType(request: HttpRequest<any>): HttpRequest<any> {

    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  private isMedia(url: string): boolean {
    return (
       url.includes('migration/save')
      || url.includes('sheets/add')
      || url.includes('sheets/save')
      || url.includes('hotlines/upload')
       || url.includes('websso')
       || url.includes('assets')
    );
  }

  private isPublicRequest(url: string): boolean {
    return  url.includes('websso');
  }

}
