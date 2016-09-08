"use strict";
var OrderSearchRequest = (function () {
    function OrderSearchRequest(ClientId, ParentId, Status, LoanNo, BorrowerName, OrderNo, LoanOfficer, TransactionType, IsDefaultView, ClientFilterVal, ShowSubClients) {
        if (ClientId === void 0) { ClientId = 0; }
        if (ParentId === void 0) { ParentId = null; }
        if (Status === void 0) { Status = ""; }
        if (LoanNo === void 0) { LoanNo = ""; }
        if (BorrowerName === void 0) { BorrowerName = ""; }
        if (OrderNo === void 0) { OrderNo = null; }
        if (LoanOfficer === void 0) { LoanOfficer = ""; }
        if (TransactionType === void 0) { TransactionType = ""; }
        if (IsDefaultView === void 0) { IsDefaultView = true; }
        if (ClientFilterVal === void 0) { ClientFilterVal = 0; }
        if (ShowSubClients === void 0) { ShowSubClients = true; }
        this.ClientId = ClientId;
        this.ParentId = ParentId;
        this.Status = Status;
        this.LoanNo = LoanNo;
        this.BorrowerName = BorrowerName;
        this.OrderNo = OrderNo;
        this.LoanOfficer = LoanOfficer;
        this.TransactionType = TransactionType;
        this.IsDefaultView = IsDefaultView;
        this.ClientFilterVal = ClientFilterVal;
        this.ShowSubClients = ShowSubClients;
    }
    return OrderSearchRequest;
}());
exports.OrderSearchRequest = OrderSearchRequest;
var OrderSearchDetail = (function () {
    function OrderSearchDetail(orderList) {
        if (orderList === void 0) { orderList = new Array(); }
        this.orderList = orderList;
    }
    return OrderSearchDetail;
}());
exports.OrderSearchDetail = OrderSearchDetail;
//# sourceMappingURL=dashboard.model.js.map