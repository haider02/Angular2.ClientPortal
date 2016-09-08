export class PropertyDetail {
    constructor(
        public PropertyType: string = "",
        public Address1: string = "",
        public Address1Name: string = "",
        public Address2: string = "",
        public zip: string = null,
        public city: string = null,
        public county: string = null,
        public state: string = null,
        public PropertyDetail: string = "",
        
        public XRefId: number = null,
        public InformationName: string = "",
        public ManagingAgentName: string = "",
        public Phone: string = "",
        public Cell: string = "",
        public Email: string = "",
        public StockCertificateNumber: string = "",
        public SharesCount: string = "",
        public IsLeaseAssigned: boolean = false,
        public LeaseDate: string = "",
        public ExpirationDate: string = "",

        public PropertyAddressSuffix: string = "PA",
        public PropertyAddressType: string = "PropertyAdditionalAddress",
        public PropertyAddress1: string = "",
        public PropertyAddress2: string = "",
        public PropertyCity: string = null,
        public PropertyState: string = null,
        public PropertyZip: string = null,
        public PropertyCounty: string = null,

        public BuyerAddressSuffix: string = "BA",
        public BuyerAddressType: string = "BorrowerAdditionalAddress",
        public BuyerAddress1: string = "",
        public BuyerAddress2: string = "",
        public BuyerCity: string = null,
        public BuyerState: string = null,
        public BuyerZip: string = null,
        public BuyerCounty: string = null,

        public SellerAddressSuffix: string = "SA",
        public SellerAddressType: string = "SellerAdditionalAddress",
        public SellerAddress1: string = "",
        public SellerAddress2: string = "",
        public SellerCity: string = null,
        public SellerState: string = null,
        public SellerZip: string = null,
        public SellerCounty: string = null,

        public PropertyDetailList: Array<any> = new Array<any>()
    ) { }
}