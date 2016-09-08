export class SecurityFormControlModel {
    constructor(
        public SecurityFormControlId: number = 0,
        public SecurityFormId: number = 1,
        public Name: string = "",
        public SecurityControlId: number = 0,
        public ParentId: number = 0,
        public Inactive: boolean = false,
        public CreatedBy: string = "",
        public CreatedDate: string = "",
        public LastModBy: string = "",
        public LastModDate: string = ""
    ) { }
}
