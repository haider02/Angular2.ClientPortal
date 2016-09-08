export class TitleClearance {
    constructor(
        public OrderNo: number = null,
        
        public ClearanceItemsList: Array<any> = new Array<any>(),
        public MortgageConnectList: Array<any> = new Array<any>(),
        public NewYorkList: Array<any> = new Array<any>(),

        public isSelectedCheckbox: boolean = true,
        public ItemName: string = "",
        public ItemAttorneyCleared: boolean = false,
        public ClearedBy: string = "",
        public ClearedDate: string = "",
        public TCD_RowId: number = null,

        public isRequestedCheckbox: boolean = true,
        public FileClearanceRequested: boolean = false,
        public FileClearanceRequestedBy: string = "",
        public FileClearanceRequestedDate: string = "",

        public FileClearanceApproved: boolean = false,
        public FileClearanceApprovedBy: string = "",
        public FileClearanceApprovedDate: string = "",

        public CEMACollateralList: Array<any> = new Array<any>(),
        public COOPCollateralList: Array<any> = new Array<any>(),

        public AssignedTitleOps: string = null,
        public From: string = "",
        public To: string = "",
        public Subject: string = "",
        public Body: string = ""
    ) { }
}