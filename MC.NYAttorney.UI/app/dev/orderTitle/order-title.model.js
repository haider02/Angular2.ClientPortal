"use strict";
var OrderTitleDetails = (function () {
    function OrderTitleDetails(TitleOrderDate, TitleExpectedDate, TitleCompletionDate, TitleEffectiveDate, SignatureRequirement, ProposedInsured, NumberofOpenMortgages, NumberofOpenJudgments, Emails, IsTitleBillRequestCompleteOrCancel, ItemNo) {
        if (TitleOrderDate === void 0) { TitleOrderDate = ""; }
        if (TitleExpectedDate === void 0) { TitleExpectedDate = ""; }
        if (TitleCompletionDate === void 0) { TitleCompletionDate = ""; }
        if (TitleEffectiveDate === void 0) { TitleEffectiveDate = ""; }
        if (SignatureRequirement === void 0) { SignatureRequirement = "0"; }
        if (ProposedInsured === void 0) { ProposedInsured = ""; }
        if (NumberofOpenMortgages === void 0) { NumberofOpenMortgages = null; }
        if (NumberofOpenJudgments === void 0) { NumberofOpenJudgments = null; }
        if (Emails === void 0) { Emails = ""; }
        if (IsTitleBillRequestCompleteOrCancel === void 0) { IsTitleBillRequestCompleteOrCancel = null; }
        if (ItemNo === void 0) { ItemNo = null; }
        this.TitleOrderDate = TitleOrderDate;
        this.TitleExpectedDate = TitleExpectedDate;
        this.TitleCompletionDate = TitleCompletionDate;
        this.TitleEffectiveDate = TitleEffectiveDate;
        this.SignatureRequirement = SignatureRequirement;
        this.ProposedInsured = ProposedInsured;
        this.NumberofOpenMortgages = NumberofOpenMortgages;
        this.NumberofOpenJudgments = NumberofOpenJudgments;
        this.Emails = Emails;
        this.IsTitleBillRequestCompleteOrCancel = IsTitleBillRequestCompleteOrCancel;
        this.ItemNo = ItemNo;
    }
    return OrderTitleDetails;
}());
exports.OrderTitleDetails = OrderTitleDetails;
//# sourceMappingURL=order-title.model.js.map