"use strict";
var CustomLocalStorage = (function () {
    function CustomLocalStorage() {
    }
    CustomLocalStorage.setItem = function (name, value) {
        var lVal = value;
        //if (name.endsWith("_Encrypt"))
        //lVal = EncryptionService.encryptItem(value);
        sessionStorage.setItem(name, lVal);
    };
    CustomLocalStorage.removeItem = function (name) {
        sessionStorage.removeItem(name);
    };
    CustomLocalStorage.getItem = function (name) {
        var lVal = sessionStorage.getItem(name);
        //if (name.endsWith("_Encrypt"))
        //  EncryptionService.decryptItem(lVal);
        return lVal;
    };
    CustomLocalStorage.clear = function () {
        sessionStorage.clear();
    };
    CustomLocalStorage.setLSItem = function (name, value) {
        localStorage.setItem(name, value);
    };
    CustomLocalStorage.getLSItem = function (name) {
        return localStorage.getItem(name);
    };
    return CustomLocalStorage;
}());
exports.CustomLocalStorage = CustomLocalStorage;
//# sourceMappingURL=customLocalStorage.js.map