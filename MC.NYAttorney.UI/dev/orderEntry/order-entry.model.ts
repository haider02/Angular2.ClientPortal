export class OrderEntryRequest {
    constructor(
        public ClientID: number = 0,
        public Suffix: string = "CM",
        public ShowMultiLevels: boolean = true        
    ) { }
}

export class OrderEntryDetailRequest {
    constructor(
        public OrderSource: string = "Website",
        public OrderOrigination: string = "",
        public EnteredBy: string = "",
        public ClientId: number = 0,
        public HaveAddress: boolean = false,
        public HaveZip: boolean = false,
        public PropertyType: string = "",
        public StreetNo: string = "",
        public StreetName: string = "",
        public Address2: string = "",
        public City: string = "",
        public State: string = "",
        public Zip: string = "",
        public County: string = "",
        public LoanNo: string = "",
        public LoanAmount: number = null,
        public LoanType: string = "",
        public Note: string = "",
        public ContactType: string = "",
        public ContactName: string = "",
        public TransactionTypeList: Array<any> = new Array<any>(),
        public BorrowerList: Array<any> = new Array<any>()
    ) { }
}