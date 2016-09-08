using System;

namespace MC.BusinessEntities.Models
{
    public class PropertyDetailEntity
    {
        public string RowId { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public bool IsActive { get; set; }

        public string PropertyDetail { get; set; }
        public string InformationName { get; set; }
        public string ManagingAgentName { get; set; }
        public string PhoneWithDash { get; set; }
        public string CellWithDash { get; set; }
        public string Phone { get; set; }
        public string Cell { get; set; }
        public string Email { get; set; }
        public string StockCertificateNumber { get; set; }
        public string SharesCount { get; set; }
        public string IsLeaseAssigned { get; set; }
        public string LeaseDate { get; set; }

        public string ExpirationDate { get; set; }
        public string PropertyAddressSuffix { get; set; }
        public string PropertyAddressType { get; set; }
        public string PropertyAddress1 { get; set; }
        public string PropertyAddress1Name { get; set; }
        public string PropertyAddress2 { get; set; }
        public string PropertyCity { get; set; }
        public string PropertyState { get; set; }
        public string PropertyZip { get; set; }
        public string PropertyCounty { get; set; }

        public string BuyerAddressSuffix { get; set; }
        public string BuyerAddressType { get; set; }
        public string BuyerAddress1 { get; set; }
        public string BuyerAddress2 { get; set; }
        public string BuyerCity { get; set; }
        public string BuyerState { get; set; }
        public string BuyerZip { get; set; }
        public string BuyerCounty { get; set; }

        public string SellerAddressSuffix { get; set; }
        public string SellerAddressType { get; set; }
        public string SellerAddress1 { get; set; }
        public string SellerAddress2 { get; set; }
        public string SellerCity { get; set; }
        public string SellerState { get; set; }
        public string SellerZip { get; set; }
        public string SellerCounty { get; set; }
    }
}
