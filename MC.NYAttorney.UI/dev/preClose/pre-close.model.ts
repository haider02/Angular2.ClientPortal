export class PreClose {
    constructor(
        public OrderNo: number = null,

        public SignatureRequirements: string = "",
        public Status: string = "",
        public ScheduledCloseDate: string = "",
        public CloserName: string = "",

        public UserName: string = "",
        public Client: string = "",
        public AnticipatedCloseDate: string = "",
        public AnticipatedCloseBy:string = "",

        public SignatureRequirementList: Array<any> = new Array<any>(),
        public PreCloseDetailList: Array<any> = new Array<any>(),
        public PreCloseDocumentList: Array<any> = new Array<any>()
        
    ) { }
}