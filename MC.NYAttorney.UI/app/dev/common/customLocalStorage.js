"use strict";
var CustomLocalStorage = (function () {
    function CustomLocalStorage() {
    }
    CustomLocalStorage.setItem = function (name, value) {
        sessionStorage.setItem(name, value);
    };
    CustomLocalStorage.removeItem = function (name) {
        sessionStorage.removeItem(name);
    };
    CustomLocalStorage.getItem = function (name) {
        return sessionStorage.getItem(name);
    };
    CustomLocalStorage.clear = function () {
        sessionStorage.clear();
    };
    return CustomLocalStorage;
}());
exports.CustomLocalStorage = CustomLocalStorage;
//# sourceMappingURL=customLocalStorage.js.map