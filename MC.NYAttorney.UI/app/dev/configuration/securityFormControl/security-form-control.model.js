"use strict";
var SecurityFormControlModel = (function () {
    function SecurityFormControlModel(SecurityFormControlId, SecurityFormId, Name, SecurityControlId, ParentId, Inactive, CreatedBy, CreatedDate, LastModBy, LastModDate) {
        if (SecurityFormControlId === void 0) { SecurityFormControlId = 0; }
        if (SecurityFormId === void 0) { SecurityFormId = 1; }
        if (Name === void 0) { Name = ""; }
        if (SecurityControlId === void 0) { SecurityControlId = 0; }
        if (ParentId === void 0) { ParentId = 0; }
        if (Inactive === void 0) { Inactive = false; }
        if (CreatedBy === void 0) { CreatedBy = ""; }
        if (CreatedDate === void 0) { CreatedDate = ""; }
        if (LastModBy === void 0) { LastModBy = ""; }
        if (LastModDate === void 0) { LastModDate = ""; }
        this.SecurityFormControlId = SecurityFormControlId;
        this.SecurityFormId = SecurityFormId;
        this.Name = Name;
        this.SecurityControlId = SecurityControlId;
        this.ParentId = ParentId;
        this.Inactive = Inactive;
        this.CreatedBy = CreatedBy;
        this.CreatedDate = CreatedDate;
        this.LastModBy = LastModBy;
        this.LastModDate = LastModDate;
    }
    return SecurityFormControlModel;
}());
exports.SecurityFormControlModel = SecurityFormControlModel;
//# sourceMappingURL=security-form-control.model.js.map