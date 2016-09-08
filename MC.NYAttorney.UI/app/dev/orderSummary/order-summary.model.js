"use strict";
var OrderSummary = (function () {
    function OrderSummary(OrderNo, ProductCode, OpenedText, OpenedDate, TitleCompleteText, TitleCompleteDate, DepartmentalCompleteText, DepartmentalCompleteDate, TitleClearedText, TitleClearedDate, TitleBillUpdateText, TitleBillUpdateDate, DocumentRecordedText, DocumentRecordedDate, FinalPolicyIssuedText, FinalPolicyIssuedDate, MileStoneTrackerList, OpenedItemText, OpenedItemStatus, OpenedItemDate, TitleItemText, TitleItemStatus, TitleItemDate, DepartmentalItemText, DepartmentalItemStatus, DepartmentalItemDate, CollateralItemText, CollateralItemStatus, CollateralItemDate, AttorneyItemText, AttorneyItemStatus, AttorneyItemDate, MortgageConnectItemText, MortgageConnectItemStatus, MortgageConnectItemDate, TitleBillItemText, TitleBillItemStatus, TitleBillItemDate, RecordingItemText, RecordingItemStatus, RecordingItemDate, PolicyItemText, PolicyItemStatus, PolicyItemDate, TitleUpdateItemText, TitleUpdateItemStatus, TitleUpdateItemDate, ItemCheckList) {
        if (OrderNo === void 0) { OrderNo = null; }
        if (ProductCode === void 0) { ProductCode = ""; }
        if (OpenedText === void 0) { OpenedText = "Opened"; }
        if (OpenedDate === void 0) { OpenedDate = null; }
        if (TitleCompleteText === void 0) { TitleCompleteText = "Title Complete"; }
        if (TitleCompleteDate === void 0) { TitleCompleteDate = null; }
        if (DepartmentalCompleteText === void 0) { DepartmentalCompleteText = "Departmental Complete"; }
        if (DepartmentalCompleteDate === void 0) { DepartmentalCompleteDate = null; }
        if (TitleClearedText === void 0) { TitleClearedText = "Title Cleared"; }
        if (TitleClearedDate === void 0) { TitleClearedDate = null; }
        if (TitleBillUpdateText === void 0) { TitleBillUpdateText = "Title Bill Update"; }
        if (TitleBillUpdateDate === void 0) { TitleBillUpdateDate = null; }
        if (DocumentRecordedText === void 0) { DocumentRecordedText = "Document Recorded"; }
        if (DocumentRecordedDate === void 0) { DocumentRecordedDate = null; }
        if (FinalPolicyIssuedText === void 0) { FinalPolicyIssuedText = "Final Policy Issued"; }
        if (FinalPolicyIssuedDate === void 0) { FinalPolicyIssuedDate = null; }
        if (MileStoneTrackerList === void 0) { MileStoneTrackerList = new Array(); }
        if (OpenedItemText === void 0) { OpenedItemText = "Opened - Order received"; }
        if (OpenedItemStatus === void 0) { OpenedItemStatus = "Complete"; }
        if (OpenedItemDate === void 0) { OpenedItemDate = null; }
        if (TitleItemText === void 0) { TitleItemText = "Title - Data being collected and Underwritten"; }
        if (TitleItemStatus === void 0) { TitleItemStatus = "In-progress"; }
        if (TitleItemDate === void 0) { TitleItemDate = null; }
        if (DepartmentalItemText === void 0) { DepartmentalItemText = "Departmental - Data being collected for review"; }
        if (DepartmentalItemStatus === void 0) { DepartmentalItemStatus = "In-progress"; }
        if (DepartmentalItemDate === void 0) { DepartmentalItemDate = null; }
        if (CollateralItemText === void 0) { CollateralItemText = "Collateral - Documents being collected for review"; }
        if (CollateralItemStatus === void 0) { CollateralItemStatus = "In-progress"; }
        if (CollateralItemDate === void 0) { CollateralItemDate = null; }
        if (AttorneyItemText === void 0) { AttorneyItemText = "Attorney Clear to Close - Attorney ready to schedule"; }
        if (AttorneyItemStatus === void 0) { AttorneyItemStatus = "In-progress"; }
        if (AttorneyItemDate === void 0) { AttorneyItemDate = null; }
        if (MortgageConnectItemText === void 0) { MortgageConnectItemText = "Mortgage Connect Clear to Close - Title Company Ready to Schedule"; }
        if (MortgageConnectItemStatus === void 0) { MortgageConnectItemStatus = "In-progress"; }
        if (MortgageConnectItemDate === void 0) { MortgageConnectItemDate = null; }
        if (TitleBillItemText === void 0) { TitleBillItemText = "Title Bill - Title Fees Prepared"; }
        if (TitleBillItemStatus === void 0) { TitleBillItemStatus = "In-progress"; }
        if (TitleBillItemDate === void 0) { TitleBillItemDate = null; }
        if (RecordingItemText === void 0) { RecordingItemText = "Recording - Recordable Documents of Record"; }
        if (RecordingItemStatus === void 0) { RecordingItemStatus = "In-progress"; }
        if (RecordingItemDate === void 0) { RecordingItemDate = null; }
        if (PolicyItemText === void 0) { PolicyItemText = "Policy - Final Policy Issued"; }
        if (PolicyItemStatus === void 0) { PolicyItemStatus = "In-progress"; }
        if (PolicyItemDate === void 0) { PolicyItemDate = null; }
        if (TitleUpdateItemText === void 0) { TitleUpdateItemText = "Title Update - Update of Title Report"; }
        if (TitleUpdateItemStatus === void 0) { TitleUpdateItemStatus = "In-progress"; }
        if (TitleUpdateItemDate === void 0) { TitleUpdateItemDate = null; }
        if (ItemCheckList === void 0) { ItemCheckList = new Array(); }
        this.OrderNo = OrderNo;
        this.ProductCode = ProductCode;
        this.OpenedText = OpenedText;
        this.OpenedDate = OpenedDate;
        this.TitleCompleteText = TitleCompleteText;
        this.TitleCompleteDate = TitleCompleteDate;
        this.DepartmentalCompleteText = DepartmentalCompleteText;
        this.DepartmentalCompleteDate = DepartmentalCompleteDate;
        this.TitleClearedText = TitleClearedText;
        this.TitleClearedDate = TitleClearedDate;
        this.TitleBillUpdateText = TitleBillUpdateText;
        this.TitleBillUpdateDate = TitleBillUpdateDate;
        this.DocumentRecordedText = DocumentRecordedText;
        this.DocumentRecordedDate = DocumentRecordedDate;
        this.FinalPolicyIssuedText = FinalPolicyIssuedText;
        this.FinalPolicyIssuedDate = FinalPolicyIssuedDate;
        this.MileStoneTrackerList = MileStoneTrackerList;
        this.OpenedItemText = OpenedItemText;
        this.OpenedItemStatus = OpenedItemStatus;
        this.OpenedItemDate = OpenedItemDate;
        this.TitleItemText = TitleItemText;
        this.TitleItemStatus = TitleItemStatus;
        this.TitleItemDate = TitleItemDate;
        this.DepartmentalItemText = DepartmentalItemText;
        this.DepartmentalItemStatus = DepartmentalItemStatus;
        this.DepartmentalItemDate = DepartmentalItemDate;
        this.CollateralItemText = CollateralItemText;
        this.CollateralItemStatus = CollateralItemStatus;
        this.CollateralItemDate = CollateralItemDate;
        this.AttorneyItemText = AttorneyItemText;
        this.AttorneyItemStatus = AttorneyItemStatus;
        this.AttorneyItemDate = AttorneyItemDate;
        this.MortgageConnectItemText = MortgageConnectItemText;
        this.MortgageConnectItemStatus = MortgageConnectItemStatus;
        this.MortgageConnectItemDate = MortgageConnectItemDate;
        this.TitleBillItemText = TitleBillItemText;
        this.TitleBillItemStatus = TitleBillItemStatus;
        this.TitleBillItemDate = TitleBillItemDate;
        this.RecordingItemText = RecordingItemText;
        this.RecordingItemStatus = RecordingItemStatus;
        this.RecordingItemDate = RecordingItemDate;
        this.PolicyItemText = PolicyItemText;
        this.PolicyItemStatus = PolicyItemStatus;
        this.PolicyItemDate = PolicyItemDate;
        this.TitleUpdateItemText = TitleUpdateItemText;
        this.TitleUpdateItemStatus = TitleUpdateItemStatus;
        this.TitleUpdateItemDate = TitleUpdateItemDate;
        this.ItemCheckList = ItemCheckList;
    }
    return OrderSummary;
}());
exports.OrderSummary = OrderSummary;
//# sourceMappingURL=order-summary.model.js.map