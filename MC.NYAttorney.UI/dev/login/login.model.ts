export class Login {
    constructor(
        public errorMessage: string = "",
        public username: string = "",
        public password: string = "",
        public rememberMe: boolean = false        
    ) { }
}
