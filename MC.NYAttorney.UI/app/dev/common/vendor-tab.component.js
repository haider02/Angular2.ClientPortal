var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var router_1 = require('angular2/router');
var app_config_1 = require('../app-config');
var menu_service_1 = require('../menu/menu.service');
var TabComponent = (function () {
    //#endregion
    /** --Constructor--
    * _http: Service object injection
    * _appConfig: Config object injection
    **/
    function TabComponent(_service, _appConfig, _router, _routeParams) {
        this.appConfig = _appConfig;
        this.httpService = _service;
        this.router = _router;
        this.routeParams = _routeParams;
    }
    //#endregion 
    /** --Lifecycle Hooks--
    * ngOnInit: To initialize grid's objects.
    **/
    TabComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this.tabCaption = enmVendorDetail[this.selectedTab];
        this.httpService.getMenusByStatus(true)
            .subscribe(function (data) { return _this.setHttpData(data); }, function (error) { return alert(error + ": error"); }, function () { return console.log(_this.appConfig.apiMsgSuccess); });
        //this.httpService.getMenusById( 3 )
        //	.subscribe(
        //	data => this.getData = JSON.stringify( data ),
        //	error => alert( error + ": error" ),
        //	() => console.log( this.appConfig.apiMsgSuccess )
        //	);
    };
    //#endregion
    TabComponent.prototype.setHttpData = function (data) {
        this.menuCollection = data;
    };
    TabComponent.prototype.routeNavigator = function (_menuModel) {
        var vendorId = +this.routeParams.get("vId");
        this.router.navigate([_menuModel.RouterLink, { vId: vendorId }]);
    };
    __decorate([
        core_1.Input()
    ], TabComponent.prototype, "selectedTab", void 0);
    TabComponent = __decorate([
        core_1.Component({
            selector: 'vendor-tab',
            templateUrl: '../dev/tpl/vendor-tab.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                menu_service_1.MenuService]
        }),
        __param(0, core_1.Inject(menu_service_1.MenuService)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG)),
        __param(2, core_1.Inject(router_1.Router)),
        __param(3, core_1.Inject(router_1.RouteParams))
    ], TabComponent);
    return TabComponent;
})();
exports.TabComponent = TabComponent;
//# sourceMappingURL=vendor-tab.component.js.map