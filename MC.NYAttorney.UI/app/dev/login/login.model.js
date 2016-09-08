"use strict";
var Login = (function () {
    function Login(errorMessage, username, password, rememberMe) {
        if (errorMessage === void 0) { errorMessage = ""; }
        if (username === void 0) { username = ""; }
        if (password === void 0) { password = ""; }
        if (rememberMe === void 0) { rememberMe = false; }
        this.errorMessage = errorMessage;
        this.username = username;
        this.password = password;
        this.rememberMe = rememberMe;
    }
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=login.model.js.map