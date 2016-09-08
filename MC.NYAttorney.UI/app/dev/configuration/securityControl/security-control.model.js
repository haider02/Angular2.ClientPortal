"use strict";
var SecurityControlModel = (function () {
    function SecurityControlModel(SecurityControlId, ControlType, Description, Inactive, CreatedBy, CreatedDate, LastModBy, LastModDate) {
        if (SecurityControlId === void 0) { SecurityControlId = 0; }
        if (ControlType === void 0) { ControlType = ""; }
        if (Description === void 0) { Description = ""; }
        if (Inactive === void 0) { Inactive = false; }
        if (CreatedBy === void 0) { CreatedBy = null; }
        if (CreatedDate === void 0) { CreatedDate = ""; }
        if (LastModBy === void 0) { LastModBy = ""; }
        if (LastModDate === void 0) { LastModDate = ""; }
        this.SecurityControlId = SecurityControlId;
        this.ControlType = ControlType;
        this.Description = Description;
        this.Inactive = Inactive;
        this.CreatedBy = CreatedBy;
        this.CreatedDate = CreatedDate;
        this.LastModBy = LastModBy;
        this.LastModDate = LastModDate;
    }
    return SecurityControlModel;
}());
exports.SecurityControlModel = SecurityControlModel;
//# sourceMappingURL=security-control.model.js.map