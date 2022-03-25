"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PurchaseComponent = void 0;
var core_1 = require("@angular/core");
var PurchaseComponent = /** @class */ (function () {
    function PurchaseComponent(purchaseService) {
        this.purchaseService = purchaseService;
    }
    PurchaseComponent.prototype.ngOnInit = function () {
    };
    PurchaseComponent.prototype.onSubmittedForm = function (params) {
        this.loadData(params);
    };
    PurchaseComponent.prototype.loadData = function (params) {
        this.purchases$ = this.purchaseService.search(params);
    };
    PurchaseComponent = __decorate([
        core_1.Component({
            selector: 'app-search',
            templateUrl: './purchase.component.html',
            styleUrls: ['./purchase.component.css']
        })
    ], PurchaseComponent);
    return PurchaseComponent;
}());
exports.PurchaseComponent = PurchaseComponent;
