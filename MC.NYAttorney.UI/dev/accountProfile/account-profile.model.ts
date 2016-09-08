export class AccountProfile {
    constructor(

        //Company Profile
        public Name: string = null,
        public Line1: string = null,
        public Line2: string = null,
        public city: string = null,
        public State: string = null,
        public Zip: string = null,
        public MainContact: string = null,

        //User Profile
        public FullName: string = null,
        public Email: string = null,
        public MyRole: string = null,
        public Contact: string = null
    ) { }
}
