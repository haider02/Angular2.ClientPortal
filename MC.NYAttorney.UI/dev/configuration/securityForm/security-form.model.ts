export class SecurityFormModel {
    constructor(
        public SecurityFormId: number = 0,
        public ApplicationId: number = 1,
        public Name: string = "",
        public Description: string = "",
        public Inactive: boolean = false,
        public CreatedBy: string = null,
        public CreatedDate: string = "",
        public LastModBy: string = "",
        public LastModDate: string = ""
    ) { }
}