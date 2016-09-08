export class OrderSearchRequest {
    constructor(
        public ClientId: number = 0,
        public ParentId: number = null,
        public Status: string = "",
        public LoanNo: string = "",
        public BorrowerName: string = "",
	    public OrderNo: number = null,
	    public LoanOfficer: string = "",
        public TransactionType: string = "",
        public IsDefaultView: boolean = true,
        public ClientFilterVal: number = 0,
        public ShowSubClients: boolean = true
    ) { }
}

export class OrderSearchDetail {
    constructor(
        public orderList: Array<any> = new Array<any>()
    ) { }
}
