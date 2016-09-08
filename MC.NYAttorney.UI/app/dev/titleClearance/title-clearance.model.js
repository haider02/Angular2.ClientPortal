"use strict";
var TitleClearance = (function () {
    function TitleClearance(OrderNo, ClearanceItemsList, MortgageConnectList, NewYorkList, isSelectedCheckbox, ItemName, ItemAttorneyCleared, ClearedBy, ClearedDate, TCD_RowId, isRequestedCheckbox, FileClearanceRequested, FileClearanceRequestedBy, FileClearanceRequestedDate, FileClearanceApproved, FileClearanceApprovedBy, FileClearanceApprovedDate, CEMACollateralList, COOPCollateralList, AssignedTitleOps, From, To, Subject, Body) {
        if (OrderNo === void 0) { OrderNo = null; }
        if (ClearanceItemsList === void 0) { ClearanceItemsList = new Array(); }
        if (MortgageConnectList === void 0) { MortgageConnectList = new Array(); }
        if (NewYorkList === void 0) { NewYorkList = new Array(); }
        if (isSelectedCheckbox === void 0) { isSelectedCheckbox = true; }
        if (ItemName === void 0) { ItemName = ""; }
        if (ItemAttorneyCleared === void 0) { ItemAttorneyCleared = false; }
        if (ClearedBy === void 0) { ClearedBy = ""; }
        if (ClearedDate === void 0) { ClearedDate = ""; }
        if (TCD_RowId === void 0) { TCD_RowId = null; }
        if (isRequestedCheckbox === void 0) { isRequestedCheckbox = true; }
        if (FileClearanceRequested === void 0) { FileClearanceRequested = false; }
        if (FileClearanceRequestedBy === void 0) { FileClearanceRequestedBy = ""; }
        if (FileClearanceRequestedDate === void 0) { FileClearanceRequestedDate = ""; }
        if (FileClearanceApproved === void 0) { FileClearanceApproved = false; }
        if (FileClearanceApprovedBy === void 0) { FileClearanceApprovedBy = ""; }
        if (FileClearanceApprovedDate === void 0) { FileClearanceApprovedDate = ""; }
        if (CEMACollateralList === void 0) { CEMACollateralList = new Array(); }
        if (COOPCollateralList === void 0) { COOPCollateralList = new Array(); }
        if (AssignedTitleOps === void 0) { AssignedTitleOps = null; }
        if (From === void 0) { From = ""; }
        if (To === void 0) { To = ""; }
        if (Subject === void 0) { Subject = ""; }
        if (Body === void 0) { Body = ""; }
        this.OrderNo = OrderNo;
        this.ClearanceItemsList = ClearanceItemsList;
        this.MortgageConnectList = MortgageConnectList;
        this.NewYorkList = NewYorkList;
        this.isSelectedCheckbox = isSelectedCheckbox;
        this.ItemName = ItemName;
        this.ItemAttorneyCleared = ItemAttorneyCleared;
        this.ClearedBy = ClearedBy;
        this.ClearedDate = ClearedDate;
        this.TCD_RowId = TCD_RowId;
        this.isRequestedCheckbox = isRequestedCheckbox;
        this.FileClearanceRequested = FileClearanceRequested;
        this.FileClearanceRequestedBy = FileClearanceRequestedBy;
        this.FileClearanceRequestedDate = FileClearanceRequestedDate;
        this.FileClearanceApproved = FileClearanceApproved;
        this.FileClearanceApprovedBy = FileClearanceApprovedBy;
        this.FileClearanceApprovedDate = FileClearanceApprovedDate;
        this.CEMACollateralList = CEMACollateralList;
        this.COOPCollateralList = COOPCollateralList;
        this.AssignedTitleOps = AssignedTitleOps;
        this.From = From;
        this.To = To;
        this.Subject = Subject;
        this.Body = Body;
    }
    return TitleClearance;
}());
exports.TitleClearance = TitleClearance;
//# sourceMappingURL=title-clearance.model.js.map