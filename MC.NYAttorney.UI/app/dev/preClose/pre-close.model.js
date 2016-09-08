"use strict";
var PreClose = (function () {
    function PreClose(OrderNo, SignatureRequirements, Status, ScheduledCloseDate, CloserName, UserName, Client, AnticipatedCloseDate, AnticipatedCloseBy, SignatureRequirementList, PreCloseDetailList, PreCloseDocumentList) {
        if (OrderNo === void 0) { OrderNo = null; }
        if (SignatureRequirements === void 0) { SignatureRequirements = ""; }
        if (Status === void 0) { Status = ""; }
        if (ScheduledCloseDate === void 0) { ScheduledCloseDate = ""; }
        if (CloserName === void 0) { CloserName = ""; }
        if (UserName === void 0) { UserName = ""; }
        if (Client === void 0) { Client = ""; }
        if (AnticipatedCloseDate === void 0) { AnticipatedCloseDate = ""; }
        if (AnticipatedCloseBy === void 0) { AnticipatedCloseBy = ""; }
        if (SignatureRequirementList === void 0) { SignatureRequirementList = new Array(); }
        if (PreCloseDetailList === void 0) { PreCloseDetailList = new Array(); }
        if (PreCloseDocumentList === void 0) { PreCloseDocumentList = new Array(); }
        this.OrderNo = OrderNo;
        this.SignatureRequirements = SignatureRequirements;
        this.Status = Status;
        this.ScheduledCloseDate = ScheduledCloseDate;
        this.CloserName = CloserName;
        this.UserName = UserName;
        this.Client = Client;
        this.AnticipatedCloseDate = AnticipatedCloseDate;
        this.AnticipatedCloseBy = AnticipatedCloseBy;
        this.SignatureRequirementList = SignatureRequirementList;
        this.PreCloseDetailList = PreCloseDetailList;
        this.PreCloseDocumentList = PreCloseDocumentList;
    }
    return PreClose;
}());
exports.PreClose = PreClose;
//# sourceMappingURL=pre-close.model.js.map