"use strict";
var ForgotPasswordDetail = (function () {
    function ForgotPasswordDetail(CurrentPassword, NewPassword, ConfirmNewPassword, SecurityCode, QuestionID, Answer, Email, ContactId, isSuccess, WebRoleId, ResponseMessage, PasswordResetUrl, EmailObject) {
        if (CurrentPassword === void 0) { CurrentPassword = ""; }
        if (NewPassword === void 0) { NewPassword = ""; }
        if (ConfirmNewPassword === void 0) { ConfirmNewPassword = ""; }
        if (SecurityCode === void 0) { SecurityCode = ""; }
        if (QuestionID === void 0) { QuestionID = 0; }
        if (Answer === void 0) { Answer = ""; }
        if (Email === void 0) { Email = ""; }
        if (ContactId === void 0) { ContactId = ""; }
        if (isSuccess === void 0) { isSuccess = false; }
        if (WebRoleId === void 0) { WebRoleId = ""; }
        if (ResponseMessage === void 0) { ResponseMessage = ""; }
        if (PasswordResetUrl === void 0) { PasswordResetUrl = ""; }
        if (EmailObject === void 0) { EmailObject = new EmailMessage(); }
        this.CurrentPassword = CurrentPassword;
        this.NewPassword = NewPassword;
        this.ConfirmNewPassword = ConfirmNewPassword;
        this.SecurityCode = SecurityCode;
        this.QuestionID = QuestionID;
        this.Answer = Answer;
        this.Email = Email;
        this.ContactId = ContactId;
        this.isSuccess = isSuccess;
        this.WebRoleId = WebRoleId;
        this.ResponseMessage = ResponseMessage;
        this.PasswordResetUrl = PasswordResetUrl;
        this.EmailObject = EmailObject;
    }
    return ForgotPasswordDetail;
}());
exports.ForgotPasswordDetail = ForgotPasswordDetail;
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
//# sourceMappingURL=forgot-password.model.js.map