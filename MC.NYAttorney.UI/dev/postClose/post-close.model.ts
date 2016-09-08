export class PostClose {
    constructor(
        public OrderNo: number = null,

        public LoanPolicyIssueDate: string = "",
        public PolicyNumber: string = "",
        
        public RecordingDetailList: Array<any> = new Array<any>(),
        public LoanPolicyList: Array<any> = new Array<any>(),
        public PostCloseDocumentList: Array<any> = new Array<any>()
        
    ) { }
}