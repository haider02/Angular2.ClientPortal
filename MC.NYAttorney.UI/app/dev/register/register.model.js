"use strict";
var RegisterDetail = (function () {
    function RegisterDetail(InvitationCode, FirstName, LastName, Email, ContactId, WebRoleId, ResponseMessage, PasswordResetUrl, EmailObject) {
        if (InvitationCode === void 0) { InvitationCode = ""; }
        if (FirstName === void 0) { FirstName = ""; }
        if (LastName === void 0) { LastName = ""; }
        if (Email === void 0) { Email = ""; }
        if (ContactId === void 0) { ContactId = ""; }
        if (WebRoleId === void 0) { WebRoleId = ""; }
        if (ResponseMessage === void 0) { ResponseMessage = ""; }
        if (PasswordResetUrl === void 0) { PasswordResetUrl = ""; }
        if (EmailObject === void 0) { EmailObject = new EmailMessage(); }
        this.InvitationCode = InvitationCode;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
        this.ContactId = ContactId;
        this.WebRoleId = WebRoleId;
        this.ResponseMessage = ResponseMessage;
        this.PasswordResetUrl = PasswordResetUrl;
        this.EmailObject = EmailObject;
    }
    return RegisterDetail;
}());
exports.RegisterDetail = RegisterDetail;
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
//# sourceMappingURL=register.model.js.map