
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { UsersService } from 'src/app/core/services/users.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';

/**
 * Loads the runtime configuration before the application starts.
 *
 * The file used to be ansible-vault encrypted and decrypted here in the browser.
 * That made sense on the legacy VMs, where Ansible rendered and encrypted it at
 * deploy time - but it never provided confidentiality, because the vault
 * password shipped inside the JavaScript bundle. On OpenShift the file comes
 * from a ConfigMap and is served as plain JSON, so the decryption step is gone.
 *
 * Nothing secret belongs in this file: the browser fetches it, so whatever it
 * contains is public to every user of the application.
 */
export function getAuthConfig(http: HttpClient, configService: AppConfigService, userService: UsersService, authService: AuthService): (() => Promise<void>) {
  return (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const url = `${environment.configPath}`;
      http.get(url).subscribe({
        next: (data: any) => {
          configService.appConfig = data.appConfig;
          // Still carried for when OIDC is reintroduced; unused today, the
          // application authenticates through SAML on the backend.
          configService.authConfig = data.authConfig;
          userService.get().subscribe({
            next: user => {
              authService.autoLogin(user);
              resolve();
            },
            // Resolve regardless: an APP_INITIALIZER that never settles leaves
            // the user on a blank page with nothing in the console.
            error: () => resolve(),
          });
        },
        error: () => resolve(),
      });
    });
  };
}
