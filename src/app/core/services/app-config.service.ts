import { Injectable } from '@angular/core';
import appConfigJson from 'src/assets/app-config.json';
@Injectable()
export class AppConfigService {
    private appConfig;
    public loadAppConfig() {
        this.appConfig = appConfigJson;
    }

    get config() {
        return this.appConfig;
    }

    get basePath() {
        return this.appConfig.api.host.baseURL;
    }
}