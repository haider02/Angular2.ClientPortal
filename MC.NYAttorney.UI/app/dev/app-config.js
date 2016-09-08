"use strict";
var core_1 = require('@angular/core');
exports.APP_CONFIG = new core_1.OpaqueToken('web.config');
exports.CONFIG = {
    devLogging: true,
    apiBaseUrl: "http://localhost:59292/MC.ClientPortal.WebApi/api",
    pageSize: 10,
    PasswordResetTokenValidHours: 48,
    GoogleRecaptchaSiteKey: "6LcKNCITAAAAAK4FaT-1L-1GVBpkyi3qDS7snNyy",
    DefaultFromEmailAddress: "noreply@MortgageConnectlp.com",
    EmailSubject: "Password Activation",
    EmailBody: "To activate your password, please click on the link below or copy and paste into a web browser." +
        " The link will be active for only PasswordResetTokenValidHours hours." +
        " Once you acivate your password, you can use this new password to login.\n\n" +
        "PasswordResetUrl" +
        "\n\nPlease contact Mortgage Connect if you have any questions or you believe you've received this email in error.\r\n" +
        "Thank you,\n" +
        "Mortgage Connect\n" +
        "www.MortgageConnectLP.com\r\n" +
        "* Please do not reply to this email. This email address is not monitored.",
    ChangePasswordSubject: "Password Changed",
    ChangePasswordBody: "You are receiving this email as a notification that your Mortgage Connect NY Attorney Portal password has changed.\r\n\r\n" +
        "Please contact Mortgage Connect if you have any questions or you believe you've received this email in error.\r\n\r\n" +
        "Thank you,\n" +
        "Mortgage Connect\n" +
        "www.MortgageConnectLP.com\r\n" +
        "* Please do not reply to this email. This email address is not monitored.",
    ForgotPasswordEmailBody: "To reset your password, please click on the link below or copy and paste into a web browser." +
        "The link will be active for only PasswordResetTokenValidHours hours." +
        "Once you change your password, you can login to the NY Attorney Portal.\n\n" +
        "PasswordResetUrl \n\nPlease contact Mortgage Connect if you have any questions or you believe you've received this email in error.\r\n" +
        "Thank you, \nMortgage Connect \nwww.MortgageConnectLP.com \r\n* Please do not reply to this email. This email address is not monitored.",
    RegisterEmailSubject: "Account Activation",
    RegisterEmailBody: "To activate your account, please click on the link below or copy and paste into a web browser." +
        "The link will be active for only PasswordResetTokenValidHours hours." +
        "Once you activate your account, you can login to the NY Attorney Portal.\n\n" +
        "PasswordResetUrl \n\nPlease contact Mortgage Connect if you have any questions or you believe you've received this email in error." +
        "Thank you, \nMortgage Connect \nwww.MortgageConnectLP.com \n* Please do not reply to this email.This email address is not monitored.",
    DateRegex: /^(?:(?:(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec))(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:(?:0?2|(?:Feb))(\/|-|\.)(?:29)\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    MenuId: 3808
};
//# sourceMappingURL=app-config.js.map