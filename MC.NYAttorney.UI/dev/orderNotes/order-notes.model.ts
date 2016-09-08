export interface OrderNotesModel {
    NoteId: number;
    OrderNo: number;
    ItemNo: number;
    Xref_RowId: number;
    Suffix: string;
    NoteSource: string;
    EventId: number;
    NoteType: string;
    Note: string;
    SentTo: string;
    Priority: boolean;
    ClientViewable: boolean;
    VendorViewable: boolean;
    BorrowerViewable: boolean;
    ClientActionReq: boolean;
    LastModDate: string;
    LastModBy: string;
    SysTimeStamp: string;
    Inactive: boolean;
}
