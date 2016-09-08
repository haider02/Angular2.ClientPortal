var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("angular2/core");
var contact_component_1 = require("./contact.component");
//import {ContactService} from "./contact.svc";
//import {Contact} from "./contact";
//import {OnInit} from "angular2/core";
var ContactListComponent = (function () {
    function ContactListComponent() {
        //public contacts: Contact[];
        ////public contacts = [];
        this.contacts = [
            { firstName: "haider", lastName: "raza", phone: "609-819-9638", email: "haider.raza@visionetsystems.com" },
            { firstName: "umair", lastName: "mufti", phone: "609-819-1235", email: "umair.mufti@visionetsystems.com" },
            { firstName: "ayesha", lastName: "khan", phone: "609-819-9876", email: "ayesha.khan@visionetsystems.com" },
            { firstName: "prasanna", lastName: "kumar", phone: "412-819-8877", email: "prasanna.kumar@visionetsystems.com" }
        ];
        this.selectedContact = {};
    }
    //private _contactService: ContactService;
    ////constructor( private _contactService: ContactService ) {
    //constructor() {
    //	//this._contactService = contactService;
    //}
    ContactListComponent.prototype.onSelect = function (contact) {
        this.selectedContact = contact;
    };
    ContactListComponent = __decorate([
        core_1.Component({
            selector: "contact-list",
            template: "\n\t<ul>\n\t\t<li *ngFor=\"#contact of contacts\"\n\t\t\t(click)=\"onSelect(contact)\"\n\t\t\t[class.clicked]=\"selectedContact === contact\"\n\t\t>\n\t\t{{contact.firstName}} {{contact.lastName}}\n\t\t</li>\n\t</ul>\n\t<contact [contact]=\"selectedContact\"></contact>\n\t<div>Test</div>\n\t",
            directives: [contact_component_1.ContactComponent]
        })
    ], ContactListComponent);
    return ContactListComponent;
})();
exports.ContactListComponent = ContactListComponent;
//class Test implements Contact {
//	firstName: string;
//	lastName: string;
//	phone: string;
//	email: string;
//	constructor() {
//		this.firstName = "Lorem";
//		this.lastName = "Ipsum";
//		this.phone = "126546547";
//		this.email = "test.email@abc.com";
//	}
//}
//class Animal {
//	private name: string;
//	constructor( theName: string ) {
//		this.name = theName;
//		alert( this.name + " moved " );
//	}
//	move( meters: number ) {
//		alert( this.name + " moved " + meters + "m." );
//	}
//} 
//# sourceMappingURL=contact-list.component.js.map