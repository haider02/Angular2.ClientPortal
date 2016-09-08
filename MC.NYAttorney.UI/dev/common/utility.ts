import {ClientStorage} from '../common/ClientStorage';
import {ClientStorageConstants} from '../common/constants';
declare var moment: any;
declare var jQuery;

export class Utility { 
    CreateGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getClientId = function () {
        let clientId = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_user_ClientId);
        if (clientId !== null) {
            return clientId;
        }

        return null;
    }

    getContactId = function () { 
        let contactId = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_user_ContactId);
        if (contactId !== null) {
            return contactId;
        }
        return null;
    }

    getContactFullName() {
        let contactName = ClientStorage.getSessionStorageItem(ClientStorageConstants.LS_user_FullName);
        if (contactName !== null) {
            return contactName;
        }
        return null;
    }

    verifyMinimumLength(value, minLength ) {
        return value.length >= minLength;
    }

    //Regex based validations
    containsNumeric(value, pattern = /\d{1}/g) {
        return pattern.test(value);
    }

    containsUpperCase(value, pattern = /[A-Z]{1}/g){
        return pattern.test(value);
    }

    containsLowerCase(value, pattern = /[a-z]{1}/g) {
        return pattern.test(value);
    }

    containsSpecial(value, pattern = /[!@#\$%\^\&*\)\(+=._-]{1}/g) {
        return pattern.test(value);
    }

    sortByAscending(array, property) {
        if (array.length == 0)
            return null;
        var minIndex = 0;
        for (var i = 0; i < array.length-1; i++) {
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
    }

    findMaxIndex(array, property) {
        if (array.length == 0)
            return null;
        var maxIndex = 0;
        for (var index = 1; index < array.length; index++) {
            if (array[maxIndex][property] < array[index][property]) {
                maxIndex = index;
            }
        }
        return maxIndex;
    }
    
    findMax(array, property) {
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
    }

    findMin(array, property) {
        if (array.length == 0)
            return null;
        var minIndex = 0;
        for (var index = 1; index < array.length; index++) {
            if (array[minIndex][property] > array[index][property]) {
                minIndex = index;
            }
        }
        return array[minIndex][property];
    }
    
    findNull(array, property) {
        if (array.length == 0)
            return null;
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] == null) {
                return true;
            }
        }
        return false;
    }
    
    findItem(array, property, value) {
        for (var index = 0; index < array.length; index++) {
            if (array[index][property] === value) {
                return index;
            }
        }
        return -1;
    }

    findAndRemove(array, property, value) {
        array.forEach(function (result, index) {
            if (result[property] === value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    }

    getCurrentDateTime(dateTimeFormat = "MM/DD/YYYY") {
        return moment().format(dateTimeFormat);
    }

    getDate(date, dateFormat = "MM/DD/YYYY") {
        if (date == null)
            return null;
        return moment(date).format(dateFormat);
    }

    getDateTime(dateTime, dateTimeFormat = "MM/DD/YYYY  HH:mm A") {
        if (dateTime == null)
            return null;
        return moment(dateTime).format(dateTimeFormat);
    }



    isBrowserIe = function () {
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

    formatPhoneCell(value) {
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
    }

    formatAmount(value, currency) {
        if (value == null || value == "")
            return "";
        return currency + " " + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }

    containsDecimal(value) {
        try {
            var isDecimal = parseFloat(value);
            if (isDecimal !== null && isNaN(isDecimal) == false)
                return true;
            return false;
        }
        catch(e) {
            return false;
        }
    }

    isDateTime(dateTime, dateTimeFormat = "MM/DD/YYYY  HH:mm A") {
        var d = moment(dateTime, dateTimeFormat);
        if (d == null || !d.isValid()) return false;

        return dateTime.indexOf(d.format(dateTimeFormat)) >= 0;
    }

    DateHandler = function (d, notificationHelper) {
        //notificationHelper.showWarningNotification('Please enter valid date (mm/dd/yyyy).', 'Warning')
        var dateRegex = /^(?:(?:(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec))(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:(?:0?2|(?:Feb))(\/|-|\.)(?:29)\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
        console.log(d);
        if (!dateRegex.test(d.target.value)) {
            console.log(d);
            d.target.focus()
            d.target.value = '';
        }
    }
}
