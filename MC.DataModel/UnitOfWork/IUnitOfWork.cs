using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Data.Entity.Validation;
using MC.DataModel.GenericRepository;
using System.Data.Entity.Core.Objects;

namespace MC.DataModel.UnitOfWork
{
    interface IUnitOfWork
    {
        /// <summary>
        /// Save method.
        /// </summary>
        void Save();


        int AddressesDelete(Nullable<int> addressId);

        List<CPSearchOrderNotesByOrderNo_Result> OrderNotesByOrderNo(Nullable<int> orderNo);

        List<DocumentsSelectAll_Result> DocumentsSelectAll(Nullable<int> iD1, Nullable<int> iD2, string docType, Nullable<bool> vendorViewable, Nullable<bool> clientViewable, Nullable<bool> borrowerViewable);

        int DocumentsInsert(Nullable<int> iD1, Nullable<int> iD2, string docType, string docPath, string description, string discRefNo, Nullable<bool> clientViewable, string docSource, string enteredBy, Nullable<System.DateTime> enteredDate, Nullable<int> eventID, Nullable<bool> vendorViewable, Nullable<bool> borrowerViewable, Nullable<int> docTypeID, string documentFolder, string uidHUDLine, string uidDisbursement, Nullable<bool> lockOtherDocs, string s3KeyName, Nullable<int> tCD_RowId, Nullable<int> disbursementId);

        int CPDocumentsInsert(Nullable<int> iD1, Nullable<int> iD2, string docType, string docPath, string description, string discRefNo, Nullable<bool> clientViewable, string docSource, string enteredBy, Nullable<System.DateTime> enteredDate, Nullable<int> eventID, Nullable<bool> vendorViewable, Nullable<bool> borrowerViewable, Nullable<int> docTypeID, string documentFolder, string uidHUDLine, string uidDisbursement, Nullable<bool> lockOtherDocs, string s3KeyName, Nullable<int> tCD_RowId, Nullable<int> disbursementId, Nullable<bool> uploadfromWeb, string uploadBy);

        List<GetStateCountyFromZip_Result> GetStateCountyFromZip(string zipcode);


        List<ContactsSelectType_Result> ContactsSelectType(Nullable<int> xRefID, string suffix);


        List<DocumentTypesSelectAllByProdCat_Result> DocumentTypesSelectAllByProdCat(string productCategory, Nullable<bool> isAvailableExternal);

        List<OrderDetailsItemsSelect_Result> OrderDetailsItemsSelect(Nullable<int> orderNo, Nullable<bool> titleOnly, Nullable<bool> closingOnly);

        string GetImagingSystemSelect();

        IEnumerable<DocumentsSelectAll_Result> DocumentsSelectAll(int vId, int iId, string docType, bool vendorViewable, bool clientViewable, bool borrowerViewable);



        IEnumerable<FeedbackPartySelectAll_Result> FeedbackPartySelectAll();


        int DocumentsLock(int rId, bool isLocked, string userName);
        int DocumentsDelete(int rId, string userName);

        List<GetCompanyGroupCodes_Result> GetCompanyGroupCodes_Result(int vendorId);
        List<GetParentClients_Result> GetParentClients(int vid, string compantGroup);
        List<GetChildLvlClients_Result> GetChildLvlClients(int vid, string xml);        

        int DeleteClientRestrictionsByTransId(int vendorId, string transId);
        int DeleteCPRClientsByIds(int vendorId, string xml);
        int DeleteClientRestrictionsByCompanyGroupCode(int vendorId, string cgc);
        int DeleteCPRClientsByParentsIds(int vendorId, string xml);
        List<int?> GetRPClientsByParentId(int vendorId, string xml);
        IEnumerable<GetInternalContacts_Result> GetInternalContacts(Nullable<int> orderNo, Nullable<int> itemNo);


        List<GetClientTransactionTypes_Result> GetClientTransactionTypes(int clientID);

        List<GetAllUserPermissionByPermissionCode_Result> GetAllUserPermissionByPermissionCode(string permissionCode);


        List<GetUserPermissionByUserIdAndPermissionCode_Result> GetUserPermissionByUserIdAndPermissionCode(string userId, string permissionCode);



        List<EventTrackingDelaysCausedBySelectAll_Result> EventTrackingDelaysCausedBySelectAll(int rowId);


        int DeleteInsertEventDelayCausedBy(string xml, int delayId);



        List<GetAuditLogClassAttibutes_Result> GetAuditLogClassAttibutes(string module, string className);

        int sysSaveAuditLog_XML_InstanceLevel(string auditLogXML, string userID, int auditTypeId, int entityPK, string instanceName);

        List<string> sysGetAuditLogs_XML_InstanceName(int auditTypeId, int entityPK, string instanceName, string userID);

        List<ContactsSelectAll_Result> GetClientContactNames(int clientID, string suffix, bool isShowMultiLevels);

        List<MaritalStatusCodesSelect_Result> GetMaritalStatus();

        int SaveOrderEntry(
                        string EnteredBy, string OrderSource, string OrderOrigination, int ClientId, bool HaveAddress, bool HaveZip,
                        string StreetNo, string StreetName, string Address2, string City, string State, string Zip, string County, string LoanNo,
                        Nullable<decimal> LoanAmount, string LoanType, string PropertyType, string Note, string ContactType, string ContactName,
                        string TransactionTypesXml, string BorrowersXml
            );

        int RegisterClient(string InvitationCode, string FirstName, string LastName, string Email, out string ResponseMessage, out string PasswordResetUrl,
                                    out string WebContactId, out string WebRoleId);

        int ContactsSetRequireUserToChangePassword(int ContactId, bool RequireChangePassword);

        bool WebChangePassword(string ContactID, string oldPassword, string newPassword, out string EmailAddress);


        int WebChangeSecretQuestion(string ContactID, int QuestionID, string Answer);

        List<ContractOrderSearch_Result> OrderSearch(Nullable<int> MinOrderNo, Nullable<int> MaxOrderNo, Nullable<int> ClientId, string Status, string LoanNo, string AssignedUser, DateTime DisbursedDate, string BorrowerName, string City, string State, string Zip, string ProductCode, Nullable<bool> Appraisal, Nullable<bool> Title, Nullable<bool> Closing, Nullable<bool> Other, string LoanOfficer, string TransactionType, Nullable<int> ShowAllClients, Nullable<int> ShowAllChildrens, Nullable<int> IsDefaultView);


        List<GetClientList_Result> GetClientList(int parentID);

        List<CPOrderSearch_Result> CPOrderSearch(string BorrowerName, string LoanNo, Nullable<int> OrderNo, string LoanOfficer, string TransactionType, string Status, Nullable<int> ClientFilterVal, Nullable<int> ClientId, Nullable<bool> ShowSubClients, int DefaultPastDays);

        List<CPOrderSummary_Result> CPOrderSummary(int OrderNo);

        List<CPGetClientList_Result> CPGetClientList(int parentID);

        List<CPGetContactNames_Result> CPGetContactNames(int lenderID);

        int SavePropertyDetail(
                        string propertyType, string address1, string address1Name, string address2, string zip, string city, string county, string state,
                        string propertyDetail, Nullable<int> xRefId, string informationName, string managingAgentName, string phone,
                        string cell, string email, string stockCertificateNumber, string sharesCount, Nullable<bool> isLeaseAssigned,
                        string leaseDate, string propertyAddressSuffix, string propertyAddressType, string propertyAddress1,
                        string propertyAddress2, string propertyCity, string propertyState, string propertyZip, string propertyCounty,
                        string propertyDetailXml, string expirationDate);

        List<CPGetOrderHeader_Result> CPOrderHeader(int OrderNo);

        List<CPGetPropertyDetail_Result> CPGetPropertyDetail(int OrderNo);

        void SaveOrderDetail(string OrderNumber, string LoanNumber, string PropertyType, bool ResidentType, int? NumberOfUnits, DateTime? YearPropertyAcquired,
                int? MortgageType, decimal? LoanAmount, string LoanRate, string LoanTerms, string LoanPurpose, string LoanProductType, DateTime? RateLockDate, DateTime? AnticipatedSettlementDate, string BorrowerXML, string EnteredBy);


        CPGetOrderDetails_Result GetOrderDetails(string OrderNumber);

        List<CPGetOrderPartyDetails_Result> GetOrderPartyDetails(string OrderNumber);

        List<GetOrderDetailByOrderNo_Result> GetOrderDetailByOrderNo(int OrderNo);

        string GetProductCodeByOrder(int OrderNo);

        List<CPGetTitleMileStone_Result> GetTitleMileStone(int OrderNo);

        List<CPGetPurchaseMileStone_Result> GetPurchaseMileStone(int OrderNo);

        List<CPGetCOOPMileStone_Result> GetCOOPMileStone(int OrderNo);

        List<CPGetTitleCheckList_Result> GetTitleCheckList(int OrderNo);

        List<CPGetPurchaseCheckList_Result> GetPurchaseCheckList(int OrderNo);

        List<CPGetCOOPCheckList_Result> GetCOOPCheckList(int OrderNo);

        GetClientDetails_Result GetClientDetials(int ContactID);

        GetCompanyDetails_Result GetCompanyDetails(int ClientID);

        int SaveOrderStatus(int orderNo);

        List<CPGetRecordingDetails_Result> GetRecordingDetails(int OrderNo);

        List<CPGetLoanPolicyDetails_Result> GetLoanPolicyDetails(int OrderNo);

        List<CPGetPostCloseDocuments_Result> GetPostCloseDocuments(int OrderNo);



        List<CPGetTitleOrderDetails_Result> CPGetOrderTitleDetail(int OrderNo);

        int CPAddTitleBillReqEvent(int OrderNo);

        int CPAddTitleProduct(int OrderNo);

        List<CPGetTitleDocumentsSelectAll_Result> CPGetTitleDocumentsSelectAll(int OrderNo);

        List<CPGetLeinsDetail_Result> CPGetLeinsDetail(int OrderNo);

        int CPAddOrderNoteInEmailQueue(int OrderNo, string Note, string NoteType);

        List<string> GetSignatureRequirement(int OrderNo);

        List<CPGetPreCloseDetails_Result> GetPreCloseDetails(int OrderNo);

        List<CPGetPreCloseDocuments_Result> GetPreCloseDocuments(int OrderNo);

        void SavePreClose(int OrderNo, string Username, string Client, DateTime ScheduleDate, DateTime AnticipatedCloseDate, string AnticipatedCloseBy);

        List<TCDetailsSelectAll_Result> GetClearanceItems(int OrderNo);

        void SaveNewYorkAttorneyItem(int OrderNo, string ClearedBy, Nullable<int> RowId);

        void SaveFileClearanceRequested(int OrderNo, string ApprovalBy, string From, string To, string Subject, string Body);

        List<CPGetTCCleartoCloseDetail_Result> GetTCCleartoCloseDetail(int OrderNo);

        List<CPGetPermissionsAgainstRole_Result> CPGetPermissionsAgainstRole(int RoleId, string ScreenName);

        List<CPGetSecurityFormControls_Result> CPGetSecurityFormControls(int ApplicationId);

        List<CPGetSecurityFormControlsConfig_Result> CPGetSecurityFormControlsConfig(int ApplicationId);

        int CPDeleteSecurityControl(int securityControlId);

        int CPDeleteSecurityForm(int securityFormId);

        int CPDeleteSecurityFormControl(int securityFormControlId);

        List<CPGetDownloadDocumentList_Result> CPGetDownloadDocumentList();

        int EmailQueueInsert(string From, string To, string Subject, string Body, string Attachment);


        bool ValidateUserEmail(string emailAddress, out string otContactID);



        int GetRegisterUserDetails(string InvitationCode, int XRefId, string Suffix, out int WebClientId, out int WebRoleId, out int SequenceNo, out int WebContactId);

        int WebUserRolesUpdate(int ContactId, int RoleId);

        List<CPTCRequestQuestionsAnswered_Result> TCRequestQuestionsAnswered(int OrderNo, string RequestType);

        List<CPGetAccountProfile_Result> GetAccountProfile(int ContactId);

    }
}
