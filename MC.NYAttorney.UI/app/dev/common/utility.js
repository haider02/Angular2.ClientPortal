"use strict";
var customLocalStorage_1 = require('../common/customLocalStorage');
var Utility = (function () {
    function Utility() {
        this.CreateGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        this.getClientId = function () {
            var clientId = customLocalStorage_1.CustomLocalStorage.getItem("user_ClientId");
            if (clientId !== null) {
                return clientId;
            }
            return null;
        };
        this.getContactId = function () {
            var contactId = customLocalStorage_1.CustomLocalStorage.getItem("user_ContactId");
            if (contactId !== null) {
                return contactId;
            }
            return null;
        };
        this.isBrowserIe = function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                // return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                return true;
            }
            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                //  return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                return true;
            }
            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                // return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                return true;
            }
            // other browser
            return false;
        };
        this.DateHandler = function (d, notificationHelper) {
            //notificationHelper.showWarningNotification('Please enter valid date (mm/dd/yyyy).', 'Warning')
            var dateRegex = /^(?:(?:(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec))(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:(?:0?2|(?:Feb))(\/|-|\.)(?:29)\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
            console.log(d);
            if (!dateRegex.test(d.target.value)) {
                console.log(d);
                d.target.focus();
                d.target.value = '';
            }
        };
    }
    Utility.prototype.getContactFullName = function () {
        var contactName = customLocalStorage_1.CustomLocalStorage.getItem("user_FullName");
        if (contactName !== null) {
            return contactName;
        }
        return null;
    };
    Utility.prototype.verifyMinimumLength = function (value, minLength) {
        return value.length >= minLength;
    };
    //Regex based validations
    Utility.prototype.containsNumeric = function (value, pattern) {
        if (pattern === void 0) { pattern = /\d{1}/g; }
        return pattern.test(value);
    };
    Utility.prototype.containsUpperCase = function (value, pattern) {
        if (pattern === void 0) { pattern = /[A-Z]{1}/g; }
        return pattern.test(value);
    };
    Utility.prototype.containsLowerCase = function (value, pattern) {
        if (pattern === void 0) { pattern = /[a-z]{1}/g; }
        return pattern.test(value);
    };
    Utility.prototype.containsSpecial = function (value, pattern) {
        if (pattern === void 0) { pattern = /[!@#\$%\^\&*\)\(+=._-]{1}/g; }
        return pattern.test(value);
    };
    Utility.prototype.sortByAscending = function (array, property) {
        if (array.length == 0)
            return null;
        var minIndex = 0;
        for (var i = 0; i < array.length - 1; i++) {
            for (var j = i + 1; j < array.length; j++) {
                if (array[i][property] > array[j][property]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                var temp = array[i];
                array[i] = array[minIndex];
                array[minIndex] = temp;
            }
            minIndex = i + 1;
        }
        return array;
    };
    Utility.prototype.findMaxIndex = function (array, property) {
        if (array.length == 0)
            return null;
        var maxIndex = 0;
        for (var index = 1; index < array.length; index++) {
            if (array[maxIndex][property] < array[index][property]) {
                maxIndex = index;
            }
        }
        return maxIndex;
    };
    Utility.prototype.findMax = function (array, property) {
        if (array.length == 0)
            return null;
        var maxIndex = 0;
        for (var index = 1; index < array.length; index++) {
            if (array[maxIndex][property] < array[index][property]) {
                maxIndex = index;
            }
            else if (array[maxIndex][property] == null) {
                maxIndex = index;
            }
        }
        return array[maxIndex][property];
    };
    Utility.prototype.findMin = function (array, property) {
        if (array.length == 0)
            return null;
        var minIndex = 0;
        for (var index = 1; index < array.length; index++) {
            if (array[minIndex][property] > array[index][property]) {
                minIndex = index;
            }
        }
        return array[minIndex][property];
    };
    Utility.prototype.findNull = function (array, property) {
        if (array.length == 0)
            return null;
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] == null) {
                return true;
            }
        }
        return false;
    };
    Utility.prototype.findItem = function (array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    };
    Utility.prototype.findAndRemove = function (array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    };
    Utility.prototype.getCurrentDateTime = function (dateTimeFormat) {
        if (dateTimeFormat === void 0) { dateTimeFormat = "MM/DD/YYYY"; }
        return moment().format(dateTimeFormat);
    };
    Utility.prototype.getDate = function (date, dateFormat) {
        if (dateFormat === void 0) { dateFormat = "MM/DD/YYYY"; }
        if (date == null)
            return null;
        return moment(date).format(dateFormat);
    };
    Utility.prototype.getDateTime = function (dateTime, dateTimeFormat) {
        if (dateTimeFormat === void 0) { dateTimeFormat = "MM/DD/YYYY  HH:mm A"; }
        if (dateTime == null)
            return null;
        return moment(dateTime).format(dateTimeFormat);
    };
    Utility.prototype.formatPhoneCell = function (value) {
        if (value == null || value == "")
            return "";
        if (value.indexOf("-") < 0) {
            var areaCode = value.substring(0, 3);
            return "(" + areaCode + ") " + value.substring(3, 6) + "-" + value.substr(6);
        }
        else {
            var areaCode = value.substring(0, value.indexOf("-"));
            var phoneFormat = "";
            if (areaCode !== "")
                phoneFormat = "(" + areaCode + ") ";
            return value.replace(value.substring(0, value.indexOf("-") + 1), phoneFormat);
        }
    };
    Utility.prototype.formatAmount = function (value, currency) {
        if (value == null || value == "")
            return "";
        return currency + " " + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    };
    Utility.prototype.containsDecimal = function (value) {
        try {
            var isDecimal = parseFloat(value);
            if (isDecimal !== null && isNaN(isDecimal) == false)
                return true;
            return false;
        }
        catch (e) {
            return false;
        }
    };
    Utility.prototype.isDateTime = function (dateTime, dateTimeFormat) {
        if (dateTimeFormat === void 0) { dateTimeFormat = "MM/DD/YYYY  HH:mm A"; }
        var d = moment(dateTime, dateTimeFormat);
        if (d == null || !d.isValid())
            return false;
        return dateTime.indexOf(d.format(dateTimeFormat)) >= 0;
    };
    return Utility;
}());
exports.Utility = Utility;
//# sourceMappingURL=utility.js.map