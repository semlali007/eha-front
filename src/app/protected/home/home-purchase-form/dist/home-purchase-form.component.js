"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomePurchaseFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var modal_page_component_1 = require("src/app/core/components/modal-page/modal-page.component");
var HomePurchaseFormComponent = /** @class */ (function () {
    function HomePurchaseFormComponent(fb, router, messageService, pageService, modalService) {
        this.fb = fb;
        this.router = router;
        this.messageService = messageService;
        this.pageService = pageService;
        this.modalService = modalService;
        this.page = {};
    }
    Object.defineProperty(HomePurchaseFormComponent.prototype, "searchText", {
        get: function () { return this.homePurchaseForm.get('searchText'); },
        enumerable: false,
        configurable: true
    });
    HomePurchaseFormComponent.prototype.ngOnInit = function () {
        this.createForm();
        this.loadPurchasePage();
    };
    HomePurchaseFormComponent.prototype.loadPurchasePage = function () {
        var _this = this;
        this.pageService.getPage({ cache: 'cache', page: 'purchase_modal_news' }).subscribe(function (data) {
            _this.page = data;
        });
    };
    HomePurchaseFormComponent.prototype.createForm = function () {
        return this.homePurchaseForm = this.fb.group({
            'searchText': ['', [
                    forms_1.Validators.required,
                ]]
        });
    };
    HomePurchaseFormComponent.prototype.submit = function () {
        var search = {
            type: 'purchase',
            searchText: this.searchText.value
        };
        this.messageService.sendMessage(search);
        this.router.navigate(['/app/ma-situation-achat']);
    };
    HomePurchaseFormComponent.prototype.openModalWithComponent = function () {
        var initialState = {
            title: 'test',
            list: [],
            page: this.page
        };
        this.bsModalRef = this.modalService.show(modal_page_component_1.ModalPageComponent, { initialState: initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
    };
    HomePurchaseFormComponent.prototype.show = function () {
        var search = {
            type: 'purchase',
            searchText: ""
        };
        this.messageService.sendMessage(search);
        this.router.navigate(['/app/ma-situation-achat']);
    };
    HomePurchaseFormComponent = __decorate([
        core_1.Component({
            selector: 'app-home-purchase-form',
            templateUrl: './home-purchase-form.component.html',
            styleUrls: ['./home-purchase-form.component.css']
        })
    ], HomePurchaseFormComponent);
    return HomePurchaseFormComponent;
}());
exports.HomePurchaseFormComponent = HomePurchaseFormComponent;
