import { Injectable } from '@angular/core';
@Injectable()
export class AppConfigService {
    appConfig: (any | undefined) = undefined;
    constructor() { }

    get config() {
        return this.appConfig;
    }

    get basePath() {
        return this.appConfig.api.host;
    }
}