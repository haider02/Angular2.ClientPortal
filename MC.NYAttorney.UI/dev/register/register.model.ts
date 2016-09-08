export class RegisterDetail {
    constructor(
        public InvitationCode: string = "",
        public FirstName: string = "",
        public LastName: string = "",
        public Email: string = "",
        public ContactId: string = "",
        public WebRoleId: string = "",
        public ResponseMessage: string = "",
        public PasswordResetUrl: string = "",        
        public EmailObject: EmailMessage = new EmailMessage()
    ) { }
}

export class EmailMessage {
    constructor(
        public From: string = "",
        public To: string = "",
        public Subject: string = "",
        public Body: string = ""
    ) { }
}