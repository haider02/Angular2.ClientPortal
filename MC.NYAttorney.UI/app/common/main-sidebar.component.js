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
//import {Route, Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
var app_config_1 = require('../app-config');
var menu_service_1 = require('../menu/menu.service');
var MainSidebarComponent = (function () {
    function MainSidebarComponent(_service, _appConfig) {
        this.appConfig = _appConfig;
        this.httpService = _service;
        //this.router = _router;
        //this.routeParams = _routeParams;
    }
    MainSidebarComponent.prototype.ngOnInit = function () {
        //this.httpService.getAllMenus()
        //    .subscribe(
        //    data => this.setHttpData(data),
        //    error => alert(error + ": error"),
        //    () => console.log(this.appConfig.apiMsgSuccess)
        //    );
    };
    MainSidebarComponent.prototype.setHttpData = function (data) {
        //this.menuCollection = data;
        //this.menuCollection = this.menuCollection.filter(x=> { return x.RefDataId == 3808 });
    };
    MainSidebarComponent.prototype.routeNavigator = function (_menuModel) {
        //let vendorId = +this.routeParams.get("vId");
        //this.router.navigate([_menuModel.RouterLink, { vId: vendorId }]);
    };
    __decorate([
        core_1.Input()
    ], MainSidebarComponent.prototype, "selectedTab", void 0);
    MainSidebarComponent = __decorate([
        core_1.Component({
            selector: 'main-sidebar',
            templateUrl: '../dev/tpl/main-sidebar.html',
            //directives: [ROUTER_DIRECTIVES],
            providers: [core_1.provide(app_config_1.APP_CONFIG, { useValue: app_config_1.CONFIG }),
                menu_service_1.MenuService
            ]
        }),
        __param(0, core_1.Inject(menu_service_1.MenuService)),
        __param(1, core_1.Inject(app_config_1.APP_CONFIG))
    ], MainSidebarComponent);
    return MainSidebarComponent;
})();
exports.MainSidebarComponent = MainSidebarComponent;
//# sourceMappingURL=main-sidebar.component.js.map