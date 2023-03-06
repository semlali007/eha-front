
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Vault} from 'ansible-vault';
export function getAuthConfig(http: HttpClient, configService: AppConfigService): (() => Promise<void>) {
  return (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const url = `${environment.configPath}`;
      http.get(url, {responseType: 'text'})
    .subscribe((config: any) => {
      const vault = new Vault({ password: `${environment.encryptionKey}` });
      vault.decrypt(`${environment.encryptionHead}${config}`, undefined).then(dataResponse=>{
       const data = JSON.parse(dataResponse);
       const cfg = {
        
       };
       configService.appConfig = data.appConfig;
       configService.authConfig = data.authConfig;
       resolve();
      });
      });
    });
  };
}
