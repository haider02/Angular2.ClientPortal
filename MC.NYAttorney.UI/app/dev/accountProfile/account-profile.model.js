"use strict";
var AccountProfile = (function () {
    function AccountProfile(
        //Company Profile
        Name, Line1, Line2, city, State, Zip, MainContact, 
        //User Profile
        FullName, Email, MyRole, Contact) {
        if (Name === void 0) { Name = null; }
        if (Line1 === void 0) { Line1 = null; }
        if (Line2 === void 0) { Line2 = null; }
        if (city === void 0) { city = null; }
        if (State === void 0) { State = null; }
        if (Zip === void 0) { Zip = null; }
        if (MainContact === void 0) { MainContact = null; }
        if (FullName === void 0) { FullName = null; }
        if (Email === void 0) { Email = null; }
        if (MyRole === void 0) { MyRole = null; }
        if (Contact === void 0) { Contact = null; }
        this.Name = Name;
        this.Line1 = Line1;
        this.Line2 = Line2;
        this.city = city;
        this.State = State;
        this.Zip = Zip;
        this.MainContact = MainContact;
        this.FullName = FullName;
        this.Email = Email;
        this.MyRole = MyRole;
        this.Contact = Contact;
    }
    return AccountProfile;
}());
exports.AccountProfile = AccountProfile;
//# sourceMappingURL=account-profile.model.js.map