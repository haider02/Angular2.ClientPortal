"use strict";
(function (enmStatus) {
    enmStatus[enmStatus["Active"] = 0] = "Active";
    enmStatus[enmStatus["Inactive"] = 1] = "Inactive";
    enmStatus[enmStatus["Disabled"] = 2] = "Disabled";
    enmStatus[enmStatus["Deleted"] = 3] = "Deleted";
    enmStatus[enmStatus["Locked"] = 4] = "Locked";
})(exports.enmStatus || (exports.enmStatus = {}));
var enmStatus = exports.enmStatus;
(function (enmTabs) {
    enmTabs[enmTabs["OrderSummary"] = 0] = "OrderSummary";
    enmTabs[enmTabs["OrderDetail"] = 1] = "OrderDetail";
    enmTabs[enmTabs["PropertyDetail"] = 2] = "PropertyDetail";
    enmTabs[enmTabs["OrderTitle"] = 3] = "OrderTitle";
    enmTabs[enmTabs["TitleClearance"] = 4] = "TitleClearance";
    enmTabs[enmTabs["PreClose"] = 5] = "PreClose";
    enmTabs[enmTabs["PostClose"] = 6] = "PostClose";
    enmTabs[enmTabs["OrderDocuments"] = 7] = "OrderDocuments";
    enmTabs[enmTabs["OrderNotes"] = 8] = "OrderNotes";
})(exports.enmTabs || (exports.enmTabs = {}));
var enmTabs = exports.enmTabs;
//# sourceMappingURL=enumerations.js.map