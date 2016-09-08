export class ChangePasswordModel {
    constructor(
        public Email: string = null,
        public OldPassword: string = "",
        public NewPassword: string = "",
        public ConfirmPassword: string = "",
        public ContactID: string = "",
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