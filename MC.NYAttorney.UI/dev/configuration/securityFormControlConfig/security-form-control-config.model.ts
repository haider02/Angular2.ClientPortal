export class SecurityFormControlConfigModel {
    constructor(
        public SecurityFormControlConfigId: number = 0,
        public SecurityFormControlId: number=0,
        public RoleId: number = 0,
        public IsVisible: boolean = false,
        public IsEnabled: boolean = false,
        public IsAuditEnabled: boolean = false,
        public Inactive: boolean = false,        
        public CreatedBy: string = "",
        public CreatedDate: string = "",
        public LastModBy: string = "",
        public LastModDate: string = "",
        public SecurityFormId: number = 0
    ) { }
}

