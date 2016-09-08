"use strict";
var OrderDetail = (function () {
    function OrderDetail(OrderMaster, PartyList) {
        if (OrderMaster === void 0) { OrderMaster = new OrderMasterDetails(); }
        if (PartyList === void 0) { PartyList = new Array(); }
        this.OrderMaster = OrderMaster;
        this.PartyList = PartyList;
    }
    return OrderDetail;
}());
exports.OrderDetail = OrderDetail;
var OrderMasterDetails = (function () {
    function OrderMasterDetails(OrderNo, OrderSource, LoanNo, PropertyType, NonOwnerOccupied, NumberofUnits, PropertyAcquiredDate, LoanCategory, LoanAmount, LoanRate, LoanProductType, LoanTerm, LoanType, RateLockDate, //Convert to date
        AnticipatedSettlementDate, //convert to date
        LoanPurpose, EnteredBy) {
        if (OrderNo === void 0) { OrderNo = ""; }
        if (OrderSource === void 0) { OrderSource = ""; }
        if (LoanNo === void 0) { LoanNo = ""; }
        if (PropertyType === void 0) { PropertyType = ""; }
        if (NonOwnerOccupied === void 0) { NonOwnerOccupied = "0"; }
        if (NumberofUnits === void 0) { NumberofUnits = ""; }
        if (PropertyAcquiredDate === void 0) { PropertyAcquiredDate = ""; }
        if (LoanCategory === void 0) { LoanCategory = null; }
        if (LoanAmount === void 0) { LoanAmount = null; }
        if (LoanRate === void 0) { LoanRate = ""; }
        if (LoanProductType === void 0) { LoanProductType = ""; }
        if (LoanTerm === void 0) { LoanTerm = ""; }
        if (LoanType === void 0) { LoanType = ""; }
        if (RateLockDate === void 0) { RateLockDate = ""; }
        if (AnticipatedSettlementDate === void 0) { AnticipatedSettlementDate = ""; }
        if (LoanPurpose === void 0) { LoanPurpose = ""; }
        if (EnteredBy === void 0) { EnteredBy = ""; }
        this.OrderNo = OrderNo;
        this.OrderSource = OrderSource;
        this.LoanNo = LoanNo;
        this.PropertyType = PropertyType;
        this.NonOwnerOccupied = NonOwnerOccupied;
        this.NumberofUnits = NumberofUnits;
        this.PropertyAcquiredDate = PropertyAcquiredDate;
        this.LoanCategory = LoanCategory;
        this.LoanAmount = LoanAmount;
        this.LoanRate = LoanRate;
        this.LoanProductType = LoanProductType;
        this.LoanTerm = LoanTerm;
        this.LoanType = LoanType;
        this.RateLockDate = RateLockDate;
        this.AnticipatedSettlementDate = AnticipatedSettlementDate;
        this.LoanPurpose = LoanPurpose;
        this.EnteredBy = EnteredBy;
    }
    return OrderMasterDetails;
}());
exports.OrderMasterDetails = OrderMasterDetails;
//# sourceMappingURL=order-detail.model.js.map