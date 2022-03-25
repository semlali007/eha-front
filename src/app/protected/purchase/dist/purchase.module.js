"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PurchaseModule = void 0;
var core_1 = require("@angular/core");
var shared_module_1 = require("src/app/shared/shared.module");
var purchase_component_1 = require("./purchase/purchase.component");
var purchase_form_component_1 = require("./purchase-form/purchase-form.component");
var purchase_result_component_1 = require("./purchase-result/purchase-result.component");
var purchase_form_words_component_1 = require("./purchase-form/purchase-form-words/purchase-form-words.component");
var purchase_filter_component_1 = require("./purchase/purchase-filter/purchase-filter.component");
var purchase_routing_module_1 = require("./purchase-routing.module");
var PurchaseModule = /** @class */ (function () {
    function PurchaseModule() {
    }
    PurchaseModule = __decorate([
        core_1.NgModule({
            declarations: [purchase_component_1.PurchaseComponent, purchase_form_component_1.PurchaseFormComponent, purchase_result_component_1.PurchaseResultComponent, purchase_form_words_component_1.PurchaseFormWordsComponent, purchase_filter_component_1.PurchaseFilterComponent],
            imports: [
                shared_module_1.SharedModule,
                purchase_routing_module_1.PurchaseRoutingModule
            ],
            exports: []
        })
    ], PurchaseModule);
    return PurchaseModule;
}());
exports.PurchaseModule = PurchaseModule;
