export class OrderDetail {
    constructor(        
        public OrderMaster = new OrderMasterDetails(),
        public PartyList: Array<any> = new Array<any>()
    ) { }
}

export class OrderMasterDetails {
    constructor(
        public OrderNo: string = "",
        public OrderSource: string = "",
        public LoanNo: string = "",
        public PropertyType: string = "",
        public NonOwnerOccupied: string = "0",
        public NumberofUnits: string = "",
        public PropertyAcquiredDate: string = "",
        public LoanCategory: string = null,
        public LoanAmount: number = null,
        public LoanRate: string = "",
        public LoanProductType: string = "",
        public LoanTerm: string = "",
        public LoanType: string = "",
        public RateLockDate: string = "", //Convert to date
        public AnticipatedSettlementDate: string = "", //convert to date
        public LoanPurpose: string = "",
        public EnteredBy: string = ""
    ) { }
}
