export class ForgotPasswordDetail {
    constructor(
        public CurrentPassword: string = "",
        public NewPassword: string = "",
        public ConfirmNewPassword: string = "",
        public SecurityCode: string = "",
        public QuestionID: number = 0,
        public Answer: string = "",
        public Email: string = "",
        public ContactId: string = "",
        public isSuccess: boolean = false,
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