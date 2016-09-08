"use strict";
var SecurityFormControlConfigModel = (function () {
    function SecurityFormControlConfigModel(SecurityFormControlConfigId, SecurityFormControlId, RoleId, IsVisible, IsEnabled, IsAuditEnabled, Inactive, CreatedBy, CreatedDate, LastModBy, LastModDate, SecurityFormId) {
        if (SecurityFormControlConfigId === void 0) { SecurityFormControlConfigId = 0; }
        if (SecurityFormControlId === void 0) { SecurityFormControlId = 0; }
        if (RoleId === void 0) { RoleId = 0; }
        if (IsVisible === void 0) { IsVisible = false; }
        if (IsEnabled === void 0) { IsEnabled = false; }
        if (IsAuditEnabled === void 0) { IsAuditEnabled = false; }
        if (Inactive === void 0) { Inactive = false; }
        if (CreatedBy === void 0) { CreatedBy = ""; }
        if (CreatedDate === void 0) { CreatedDate = ""; }
        if (LastModBy === void 0) { LastModBy = ""; }
        if (LastModDate === void 0) { LastModDate = ""; }
        if (SecurityFormId === void 0) { SecurityFormId = 0; }
        this.SecurityFormControlConfigId = SecurityFormControlConfigId;
        this.SecurityFormControlId = SecurityFormControlId;
        this.RoleId = RoleId;
        this.IsVisible = IsVisible;
        this.IsEnabled = IsEnabled;
        this.IsAuditEnabled = IsAuditEnabled;
        this.Inactive = Inactive;
        this.CreatedBy = CreatedBy;
        this.CreatedDate = CreatedDate;
        this.LastModBy = LastModBy;
        this.LastModDate = LastModDate;
        this.SecurityFormId = SecurityFormId;
    }
    return SecurityFormControlConfigModel;
}());
exports.SecurityFormControlConfigModel = SecurityFormControlConfigModel;
//# sourceMappingURL=security-form-control-config.model.js.map