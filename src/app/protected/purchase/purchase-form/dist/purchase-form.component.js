"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PurchaseFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var PurchaseFormComponent = /** @class */ (function () {
    function PurchaseFormComponent(fb, messageService) {
        this.fb = fb;
        this.messageService = messageService;
        this.submittedForm = new core_1.EventEmitter();
    }
    PurchaseFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createSearchForm();
        this.subscription = this.messageService.getMessage().subscribe(function (searchData) {
            if (!!searchData && !!searchData.type && (searchData.type == 'purchase')) {
                _this.words.setValue(searchData.searchText);
                _this.submit();
            }
        });
    };
    Object.defineProperty(PurchaseFormComponent.prototype, "words", {
        get: function () { return this.searchForm.get('words'); },
        enumerable: false,
        configurable: true
    });
    PurchaseFormComponent.prototype.createSearchForm = function () {
        return this.searchForm = this.fb.group({
            'words': ['', [forms_1.Validators.required]]
        });
    };
    PurchaseFormComponent.prototype.submit = function () {
        var params = { words: this.words.value };
        this.submittedForm.emit(params);
    };
    PurchaseFormComponent.prototype.ngOnDestroy = function () {
        if (this.subscription)
            this.subscription.unsubscribe();
    };
    __decorate([
        core_1.Output()
    ], PurchaseFormComponent.prototype, "submittedForm");
    PurchaseFormComponent = __decorate([
        core_1.Component({
            selector: 'app-purchase-form',
            templateUrl: './purchase-form.component.html',
            styles: []
        })
    ], PurchaseFormComponent);
    return PurchaseFormComponent;
}());
exports.PurchaseFormComponent = PurchaseFormComponent;
