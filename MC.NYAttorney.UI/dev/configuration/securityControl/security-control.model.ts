export class SecurityControlModel {
    constructor(
        public SecurityControlId: number = 0,
        public ControlType: string = "",
        public Description: string = "",
        public Inactive: boolean = false,
        public CreatedBy: string = null,
        public CreatedDate: string = "",
        public LastModBy: string = "",
        public LastModDate: string = ""
    ) { }
}