"use strict";
var PostClose = (function () {
    function PostClose(OrderNo, LoanPolicyIssueDate, PolicyNumber, RecordingDetailList, LoanPolicyList, PostCloseDocumentList) {
        if (OrderNo === void 0) { OrderNo = null; }
        if (LoanPolicyIssueDate === void 0) { LoanPolicyIssueDate = ""; }
        if (PolicyNumber === void 0) { PolicyNumber = ""; }
        if (RecordingDetailList === void 0) { RecordingDetailList = new Array(); }
        if (LoanPolicyList === void 0) { LoanPolicyList = new Array(); }
        if (PostCloseDocumentList === void 0) { PostCloseDocumentList = new Array(); }
        this.OrderNo = OrderNo;
        this.LoanPolicyIssueDate = LoanPolicyIssueDate;
        this.PolicyNumber = PolicyNumber;
        this.RecordingDetailList = RecordingDetailList;
        this.LoanPolicyList = LoanPolicyList;
        this.PostCloseDocumentList = PostCloseDocumentList;
    }
    return PostClose;
}());
exports.PostClose = PostClose;
//# sourceMappingURL=post-close.model.js.map