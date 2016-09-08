"use strict";
var PropertyDetail = (function () {
    function PropertyDetail(PropertyType, Address1, Address1Name, Address2, zip, city, county, state, PropertyDetail, XRefId, InformationName, ManagingAgentName, Phone, Cell, Email, StockCertificateNumber, SharesCount, IsLeaseAssigned, LeaseDate, ExpirationDate, PropertyAddressSuffix, PropertyAddressType, PropertyAddress1, PropertyAddress2, PropertyCity, PropertyState, PropertyZip, PropertyCounty, BuyerAddressSuffix, BuyerAddressType, BuyerAddress1, BuyerAddress2, BuyerCity, BuyerState, BuyerZip, BuyerCounty, SellerAddressSuffix, SellerAddressType, SellerAddress1, SellerAddress2, SellerCity, SellerState, SellerZip, SellerCounty, PropertyDetailList) {
        if (PropertyType === void 0) { PropertyType = ""; }
        if (Address1 === void 0) { Address1 = ""; }
        if (Address1Name === void 0) { Address1Name = ""; }
        if (Address2 === void 0) { Address2 = ""; }
        if (zip === void 0) { zip = null; }
        if (city === void 0) { city = null; }
        if (county === void 0) { county = null; }
        if (state === void 0) { state = null; }
        if (PropertyDetail === void 0) { PropertyDetail = ""; }
        if (XRefId === void 0) { XRefId = null; }
        if (InformationName === void 0) { InformationName = ""; }
        if (ManagingAgentName === void 0) { ManagingAgentName = ""; }
        if (Phone === void 0) { Phone = ""; }
        if (Cell === void 0) { Cell = ""; }
        if (Email === void 0) { Email = ""; }
        if (StockCertificateNumber === void 0) { StockCertificateNumber = ""; }
        if (SharesCount === void 0) { SharesCount = ""; }
        if (IsLeaseAssigned === void 0) { IsLeaseAssigned = false; }
        if (LeaseDate === void 0) { LeaseDate = ""; }
        if (ExpirationDate === void 0) { ExpirationDate = ""; }
        if (PropertyAddressSuffix === void 0) { PropertyAddressSuffix = "PA"; }
        if (PropertyAddressType === void 0) { PropertyAddressType = "PropertyAdditionalAddress"; }
        if (PropertyAddress1 === void 0) { PropertyAddress1 = ""; }
        if (PropertyAddress2 === void 0) { PropertyAddress2 = ""; }
        if (PropertyCity === void 0) { PropertyCity = null; }
        if (PropertyState === void 0) { PropertyState = null; }
        if (PropertyZip === void 0) { PropertyZip = null; }
        if (PropertyCounty === void 0) { PropertyCounty = null; }
        if (BuyerAddressSuffix === void 0) { BuyerAddressSuffix = "BA"; }
        if (BuyerAddressType === void 0) { BuyerAddressType = "BorrowerAdditionalAddress"; }
        if (BuyerAddress1 === void 0) { BuyerAddress1 = ""; }
        if (BuyerAddress2 === void 0) { BuyerAddress2 = ""; }
        if (BuyerCity === void 0) { BuyerCity = null; }
        if (BuyerState === void 0) { BuyerState = null; }
        if (BuyerZip === void 0) { BuyerZip = null; }
        if (BuyerCounty === void 0) { BuyerCounty = null; }
        if (SellerAddressSuffix === void 0) { SellerAddressSuffix = "SA"; }
        if (SellerAddressType === void 0) { SellerAddressType = "SellerAdditionalAddress"; }
        if (SellerAddress1 === void 0) { SellerAddress1 = ""; }
        if (SellerAddress2 === void 0) { SellerAddress2 = ""; }
        if (SellerCity === void 0) { SellerCity = null; }
        if (SellerState === void 0) { SellerState = null; }
        if (SellerZip === void 0) { SellerZip = null; }
        if (SellerCounty === void 0) { SellerCounty = null; }
        if (PropertyDetailList === void 0) { PropertyDetailList = new Array(); }
        this.PropertyType = PropertyType;
        this.Address1 = Address1;
        this.Address1Name = Address1Name;
        this.Address2 = Address2;
        this.zip = zip;
        this.city = city;
        this.county = county;
        this.state = state;
        this.PropertyDetail = PropertyDetail;
        this.XRefId = XRefId;
        this.InformationName = InformationName;
        this.ManagingAgentName = ManagingAgentName;
        this.Phone = Phone;
        this.Cell = Cell;
        this.Email = Email;
        this.StockCertificateNumber = StockCertificateNumber;
        this.SharesCount = SharesCount;
        this.IsLeaseAssigned = IsLeaseAssigned;
        this.LeaseDate = LeaseDate;
        this.ExpirationDate = ExpirationDate;
        this.PropertyAddressSuffix = PropertyAddressSuffix;
        this.PropertyAddressType = PropertyAddressType;
        this.PropertyAddress1 = PropertyAddress1;
        this.PropertyAddress2 = PropertyAddress2;
        this.PropertyCity = PropertyCity;
        this.PropertyState = PropertyState;
        this.PropertyZip = PropertyZip;
        this.PropertyCounty = PropertyCounty;
        this.BuyerAddressSuffix = BuyerAddressSuffix;
        this.BuyerAddressType = BuyerAddressType;
        this.BuyerAddress1 = BuyerAddress1;
        this.BuyerAddress2 = BuyerAddress2;
        this.BuyerCity = BuyerCity;
        this.BuyerState = BuyerState;
        this.BuyerZip = BuyerZip;
        this.BuyerCounty = BuyerCounty;
        this.SellerAddressSuffix = SellerAddressSuffix;
        this.SellerAddressType = SellerAddressType;
        this.SellerAddress1 = SellerAddress1;
        this.SellerAddress2 = SellerAddress2;
        this.SellerCity = SellerCity;
        this.SellerState = SellerState;
        this.SellerZip = SellerZip;
        this.SellerCounty = SellerCounty;
        this.PropertyDetailList = PropertyDetailList;
    }
    return PropertyDetail;
}());
exports.PropertyDetail = PropertyDetail;
//# sourceMappingURL=property-detail.model.js.map