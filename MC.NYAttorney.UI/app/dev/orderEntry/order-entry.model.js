"use strict";
var OrderEntryRequest = (function () {
    function OrderEntryRequest(ClientID, Suffix, ShowMultiLevels) {
        if (ClientID === void 0) { ClientID = 0; }
        if (Suffix === void 0) { Suffix = "CM"; }
        if (ShowMultiLevels === void 0) { ShowMultiLevels = true; }
        this.ClientID = ClientID;
        this.Suffix = Suffix;
        this.ShowMultiLevels = ShowMultiLevels;
    }
    return OrderEntryRequest;
}());
exports.OrderEntryRequest = OrderEntryRequest;
var OrderEntryDetailRequest = (function () {
    function OrderEntryDetailRequest(OrderSource, OrderOrigination, EnteredBy, ClientId, HaveAddress, HaveZip, PropertyType, StreetNo, StreetName, Address2, City, State, Zip, County, LoanNo, LoanAmount, LoanType, Note, ContactType, ContactName, TransactionTypeList, BorrowerList) {
        if (OrderSource === void 0) { OrderSource = "Website"; }
        if (OrderOrigination === void 0) { OrderOrigination = ""; }
        if (EnteredBy === void 0) { EnteredBy = ""; }
        if (ClientId === void 0) { ClientId = 0; }
        if (HaveAddress === void 0) { HaveAddress = false; }
        if (HaveZip === void 0) { HaveZip = false; }
        if (PropertyType === void 0) { PropertyType = ""; }
        if (StreetNo === void 0) { StreetNo = ""; }
        if (StreetName === void 0) { StreetName = ""; }
        if (Address2 === void 0) { Address2 = ""; }
        if (City === void 0) { City = ""; }
        if (State === void 0) { State = ""; }
        if (Zip === void 0) { Zip = ""; }
        if (County === void 0) { County = ""; }
        if (LoanNo === void 0) { LoanNo = ""; }
        if (LoanAmount === void 0) { LoanAmount = null; }
        if (LoanType === void 0) { LoanType = ""; }
        if (Note === void 0) { Note = ""; }
        if (ContactType === void 0) { ContactType = ""; }
        if (ContactName === void 0) { ContactName = ""; }
        if (TransactionTypeList === void 0) { TransactionTypeList = new Array(); }
        if (BorrowerList === void 0) { BorrowerList = new Array(); }
        this.OrderSource = OrderSource;
        this.OrderOrigination = OrderOrigination;
        this.EnteredBy = EnteredBy;
        this.ClientId = ClientId;
        this.HaveAddress = HaveAddress;
        this.HaveZip = HaveZip;
        this.PropertyType = PropertyType;
        this.StreetNo = StreetNo;
        this.StreetName = StreetName;
        this.Address2 = Address2;
        this.City = City;
        this.State = State;
        this.Zip = Zip;
        this.County = County;
        this.LoanNo = LoanNo;
        this.LoanAmount = LoanAmount;
        this.LoanType = LoanType;
        this.Note = Note;
        this.ContactType = ContactType;
        this.ContactName = ContactName;
        this.TransactionTypeList = TransactionTypeList;
        this.BorrowerList = BorrowerList;
    }
    return OrderEntryDetailRequest;
}());
exports.OrderEntryDetailRequest = OrderEntryDetailRequest;
//# sourceMappingURL=order-entry.model.js.map