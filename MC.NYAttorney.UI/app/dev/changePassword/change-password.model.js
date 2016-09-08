"use strict";
var ChangePasswordModel = (function () {
    function ChangePasswordModel(Email, OldPassword, NewPassword, ConfirmPassword, ContactID, EmailObject) {
        if (Email === void 0) { Email = null; }
        if (OldPassword === void 0) { OldPassword = ""; }
        if (NewPassword === void 0) { NewPassword = ""; }
        if (ConfirmPassword === void 0) { ConfirmPassword = ""; }
        if (ContactID === void 0) { ContactID = ""; }
        if (EmailObject === void 0) { EmailObject = new EmailMessage(); }
        this.Email = Email;
        this.OldPassword = OldPassword;
        this.NewPassword = NewPassword;
        this.ConfirmPassword = ConfirmPassword;
        this.ContactID = ContactID;
        this.EmailObject = EmailObject;
    }
    return ChangePasswordModel;
}());
exports.ChangePasswordModel = ChangePasswordModel;
var EmailMessage = (function () {
    function EmailMessage(From, To, Subject, Body) {
        if (From === void 0) { From = ""; }
        if (To === void 0) { To = ""; }
        if (Subject === void 0) { Subject = ""; }
        if (Body === void 0) { Body = ""; }
        this.From = From;
        this.To = To;
        this.Subject = Subject;
        this.Body = Body;
    }
    return EmailMessage;
}());
exports.EmailMessage = EmailMessage;
//# sourceMappingURL=change-password.model.js.map