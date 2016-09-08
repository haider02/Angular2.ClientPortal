"use strict";
var SecurityFormModel = (function () {
    function SecurityFormModel(SecurityFormId, ApplicationId, Name, Description, Inactive, CreatedBy, CreatedDate, LastModBy, LastModDate) {
        if (SecurityFormId === void 0) { SecurityFormId = 0; }
        if (ApplicationId === void 0) { ApplicationId = 1; }
        if (Name === void 0) { Name = ""; }
        if (Description === void 0) { Description = ""; }
        if (Inactive === void 0) { Inactive = false; }
        if (CreatedBy === void 0) { CreatedBy = null; }
        if (CreatedDate === void 0) { CreatedDate = ""; }
        if (LastModBy === void 0) { LastModBy = ""; }
        if (LastModDate === void 0) { LastModDate = ""; }
        this.SecurityFormId = SecurityFormId;
        this.ApplicationId = ApplicationId;
        this.Name = Name;
        this.Description = Description;
        this.Inactive = Inactive;
        this.CreatedBy = CreatedBy;
        this.CreatedDate = CreatedDate;
        this.LastModBy = LastModBy;
        this.LastModDate = LastModDate;
    }
    return SecurityFormModel;
}());
exports.SecurityFormModel = SecurityFormModel;
//# sourceMappingURL=security-form.model.js.map