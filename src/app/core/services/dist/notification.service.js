"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NotificationService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var NotificationService = /** @class */ (function () {
    function NotificationService(appConfigService, http, loaderService, errorService) {
        this.appConfigService = appConfigService;
        this.http = http;
        this.loaderService = loaderService;
        this.errorService = errorService;
        this.notification = new rxjs_1.BehaviorSubject(null);
        this.notification$ = this.notification.asObservable();
    }
    NotificationService.prototype.showNotification = function (notification) {
        this.notification.next(notification);
    };
    NotificationService.prototype.closeNotification = function () {
        this.notification.next(null);
    };
    NotificationService.prototype.getUserNotification = function (options) {
        var _this = this;
        var url = this.appConfigService.basePath + "/notifications/list/" + options.nni;
        return this.http.get(url).pipe(operators_1.switchMap(function (response) {
            return rxjs_1.of(response);
        }), operators_1.catchError(function (error) { return _this.errorService.handleError(error); }));
    };
    NotificationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], NotificationService);
    return NotificationService;
}());
exports.NotificationService = NotificationService;
