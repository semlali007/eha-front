"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GenericItemViewComponent = void 0;
var core_1 = require("@angular/core");
var GenericItemViewComponent = /** @class */ (function () {
    function GenericItemViewComponent(genericItemService, route) {
        this.genericItemService = genericItemService;
        this.route = route;
        this.code = '';
        this.item = {};
    }
    GenericItemViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            if (!!params.code) {
                _this.code = params.code;
                _this.loadItem();
            }
        });
    };
    GenericItemViewComponent.prototype.loadItem = function () {
        var _this = this;
        this.genericItemService.get({
            code: this.code
        }).subscribe(function (item) {
            if (!item)
                return;
            _this.item = item;
        });
    };
    GenericItemViewComponent = __decorate([
        core_1.Component({
            selector: 'generic-item-view',
            templateUrl: './generic-item-view.component.html',
            styleUrls: ['./generic-item-view.component.css']
        })
    ], GenericItemViewComponent);
    return GenericItemViewComponent;
}());
exports.GenericItemViewComponent = GenericItemViewComponent;
