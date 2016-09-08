export class OrderTitleDetails {
    constructor(
        public TitleOrderDate: string = "",
        public TitleExpectedDate: string = "",
        public TitleCompletionDate: string = "",
        public TitleEffectiveDate: string = "",
        public SignatureRequirement: string = "0",
        public ProposedInsured: string = "",
        public NumberofOpenMortgages: number = null,
        public NumberofOpenJudgments: number = null,        
        public Emails: string = "",
        public IsTitleBillRequestCompleteOrCancel: number = null,
        public ItemNo: number = null        
    ) { }
}
