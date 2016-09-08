"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var DirectoryViewComponent = (function () {
    //#endregion 
    function DirectoryViewComponent() {
        /** --Property Segment--
        * List of the properties.
        **/
        this.editSelectedRow = new core_1.EventEmitter();
    }
    /**
    *   Initilize vairables
    **/
    DirectoryViewComponent.prototype.ngOnInit = function () {
        if (this.eventemiter !== null)
            this.editSelectedRow = this.eventemiter;
    };
    /**
    *   emits data to parent component
    **/
    DirectoryViewComponent.prototype.clicked = function (dir) {
        dir.toggle();
        if (this.eventemiter !== null) {
            this.eventemiter.emit(dir);
        }
        else {
            this.editSelectedRow.emit(dir);
        }
    };
    __decorate([
        core_1.Output()
    ], DirectoryViewComponent.prototype, "editSelectedRow", void 0);
    __decorate([
        core_1.Input()
    ], DirectoryViewComponent.prototype, "treeViewList", void 0);
    __decorate([
        core_1.Input()
    ], DirectoryViewComponent.prototype, "eventemiter", void 0);
    __decorate([
        core_1.Input()
    ], DirectoryViewComponent.prototype, "isCheckboxEnabled", void 0);
    DirectoryViewComponent = __decorate([
        core_1.Component({
            selector: 'directory-view',
            templateUrl: '../dev/tpl/tree-view.html',
            directives: [DirectoryViewComponent]
        })
    ], DirectoryViewComponent);
    return DirectoryViewComponent;
}());
exports.DirectoryViewComponent = DirectoryViewComponent;
//# sourceMappingURL=tree-view.component.js.map