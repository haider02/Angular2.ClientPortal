var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("angular2/core");
var ContactComponent = (function () {
    function ContactComponent() {
        this.contact = {};
    }
    ContactComponent = __decorate([
        core_1.Component({
            selector: "contact",
            template: "\n\t<div>\n\t\t<div>\n\t\t\tFirst Name:\n\t\t\t<input [(ngModel)]=\"contact.firstName\" type=\"text\">\n\t\t</div>\n\t\t<div>\n\t\t\tLast Name:\n\t\t\t<input [(ngModel)]=\"contact.lastName\" type=\"text\">\n\t\t</div>\n\t\t<div>\n\t\t\tPhone:\n\t\t\t<input [(ngModel)]=\"contact.phone\" type=\"text\">\n\t\t</div>\n\t\t<div>\n\t\t\tEmail:\n\t\t\t<input [(ngModel)]=\"contact.email\" type=\"text\">\n\t\t</div>\n\t</div>\n\t",
            inputs: ["contact"]
        })
    ], ContactComponent);
    return ContactComponent;
})();
exports.ContactComponent = ContactComponent;
//# sourceMappingURL=contact.component.js.map