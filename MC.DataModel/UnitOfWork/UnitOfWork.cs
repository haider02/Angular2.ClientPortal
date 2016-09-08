using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Data.Entity.Validation;
using MC.DataModel.GenericRepository;
using System.Data.Entity.Core.Objects;

namespace MC.DataModel.UnitOfWork
{
    /// <summary>
    /// Unit of Work class responsible for DB transactions
    /// </summary>
    public class UnitOfWork : IDisposable, IUnitOfWork
    {
        #region "Field Segment"

        private readonly WebApiDbEntities _context = null;
        private GenericRepository<UserId> _userRepository;
        
        
        //private GenericRepository<Products> _productRepository;
        
        private GenericRepository<Documents> _documentsRepository;
        private GenericRepository<States> _stateRepository;
        private GenericRepository<Cities> _cityRepository;
        
        private GenericRepository<Counties> _countyRepository;
        private GenericRepository<Addresses> _addressRepository;
        private GenericRepository<ComboEntries> _comboEntryRepository;
        private GenericRepository<DocumentsSelectAll_Result> _documentsSelectAll_ResultRepository;
        //private GenericRepository<Contacts> _vendorAssociateRepository;
        private GenericRepository<sysMenu> _menuRepository;
        private GenericRepository<EmailType> _emailTypeRepository;
        //private GenericRepository<Notes> _notesRepository;        
        private GenericRepository<OrderMaster> _orderMasterRepository;
        private GenericRepository<OrderNotes> _orderNotes;
        private GenericRepository<SecurityControl> _securityControl;
        private GenericRepository<SecurityForm> _securityForm;
        private GenericRepository<SecurityFormControl> _securityFormControl;
        private GenericRepository<SecurityFormControlConfig> _securityFormControlControlConfig;
        private GenericRepository<WebRoles> _webRoles;
        #endregion

        public UnitOfWork()
        {
            _context = new WebApiDbEntities();
        }

        #region "Public Repository Creation Properties"

        /// <summary>
        /// Get/Set Property for Menu repository.
        /// </summary>
        public GenericRepository<sysMenu> MenuRepository
        {
            get
            {
                if (this._menuRepository == null)
                    this._menuRepository = new GenericRepository<sysMenu>(_context);
                return _menuRepository;
            }
        }

        

        /// <summary>
        /// Get/Set Property for OrderNotes repository.
        /// </summary>
        public GenericRepository<OrderNotes> OrderNotesRepository
        {
            get
            {
                if (this._orderNotes == null)
                    this._orderNotes = new GenericRepository<OrderNotes>(_context);
                return _orderNotes;
            }
        }


        /// <summary>
        /// Get/Set Property for Document repository.
        /// </summary>
        public GenericRepository<Documents> DocumentRepository
        {
            get
            {
                if (this._documentsRepository == null)
                    this._documentsRepository = new GenericRepository<Documents>(_context);
                return _documentsRepository;
            }
        }

        
        /// <summary>
        /// Get/Set Property for user repository.
        /// </summary>
        public GenericRepository<UserId> UserIdRepository
        {
            get
            {
                if (this._userRepository == null)
                    this._userRepository = new GenericRepository<UserId>(_context);
                return _userRepository;
            }
        }

        /*  /// <summary>
          /// Get/Set Property for token repository.
          /// </summary>
          public GenericRepository<Token> TokenRepository
          {
              get
              {
                  if (this._tokenRepository == null)
                      this._tokenRepository = new GenericRepository<Token>(_context);
                  return _tokenRepository;
              }
          }*/

        /// <summary>
        /// Get/Set Property for products repository.
        /// </summary>
        //public GenericRepository<Products> ProductRepository
        //{
        //    get
        //    {
        //        if (this._productRepository == null)
        //            this._productRepository = new GenericRepository<Products>(_context);
        //        return _productRepository;
        //    }
        //}

        /// <summary>
        /// Get/Set Property for Address repository.
        /// </summary>
        public GenericRepository<Addresses> AddressRepository
        {
            get
            {
                if (this._addressRepository == null)
                    this._addressRepository = new GenericRepository<Addresses>(_context);
                return _addressRepository;
            }
        }

        

        /// <summary>
        /// Get/Set Property for States repository.
        /// </summary>
        public GenericRepository<States> StatesRepository
        {
            get
            {
                if (this._stateRepository == null)
                    this._stateRepository = new GenericRepository<States>(_context);
                return _stateRepository;
            }
        }

        /// <su
        /// mmary>
        /// Get/Set Property for States repository.
        /// </summary>
        public GenericRepository<DocumentsSelectAll_Result> DocumentsSelectAll_ResultRepository
        {
            get
            {
                if (this._documentsSelectAll_ResultRepository == null)
                    this._documentsSelectAll_ResultRepository = new GenericRepository<DocumentsSelectAll_Result>(_context);
                return _documentsSelectAll_ResultRepository;
            }
        }

        public GenericRepository<Cities> CityRepository
        {
            get
            {
                if (this._cityRepository == null)
                    this._cityRepository = new GenericRepository<Cities>(_context);
                return _cityRepository;
            }
        }

        public GenericRepository<Cities> VendorSearchRepository
        {
            get
            {
                if (this._cityRepository == null)
                    this._cityRepository = new GenericRepository<Cities>(_context);
                return _cityRepository;
            }
        }

        public GenericRepository<Counties> CountyRepository
        {
            get
            {
                if (this._countyRepository == null)
                    this._countyRepository = new GenericRepository<Counties>(_context);
                return _countyRepository;
            }
        }

        public GenericRepository<ComboEntries> ComboEntryRepository
        {
            get
            {
                if (this._comboEntryRepository == null)
                    this._comboEntryRepository = new GenericRepository<ComboEntries>(_context);
                return _comboEntryRepository;
            }
        }

        

        /// <summary>
        /// Vendor Diversity 
        /// </summary>
        public GenericRepository<EmailType> EmailTypeRepository
        {
            get
            {
                if (this._emailTypeRepository == null)
                    this._emailTypeRepository = new GenericRepository<EmailType>(_context);
                return _emailTypeRepository;
            }
        }

        /// <summary>
        /// Notes 
        /// </summary>
        //public GenericRepository<Notes> NotesRepository
        //{
        //    get
        //    {
        //        if (this._notesRepository == null)
        //            this._notesRepository = new GenericRepository<Notes>(_context);
        //        return _notesRepository;
        //    }
        //}

        




        /// <summary>
        /// Order Master
        /// </summary>
        public GenericRepository<OrderMaster> OrderMasterRepository
        {
            get
            {
                if (this._orderMasterRepository == null)
                    this._orderMasterRepository = new GenericRepository<OrderMaster>(_context);
                return _orderMasterRepository;
            }
        }

        
        public GenericRepository<SecurityControl> SecurityControlRepository
        {
            get
            {
                if (this._securityControl == null)
                    this._securityControl = new GenericRepository<SecurityControl>(_context);
                return _securityControl;
            }
        }

        public GenericRepository<SecurityForm> SecurityFormRepository
        {
            get
            {
                if (this._securityForm == null)
                    this._securityForm = new GenericRepository<SecurityForm>(_context);
                return _securityForm;
            }
        }

        public GenericRepository<SecurityFormControl> SecurityFormControlRepository
        {
            get
            {
                if (this._securityFormControl == null)
                    this._securityFormControl = new GenericRepository<SecurityFormControl>(_context);
                return _securityFormControl;
            }
        }

        public GenericRepository<SecurityFormControlConfig> SecurityFormControlConfigRepository
        {
            get
            {
                if (this._securityFormControlControlConfig == null)
                    this._securityFormControlControlConfig = new GenericRepository<SecurityFormControlConfig>(_context);
                return _securityFormControlControlConfig;
            }
        }

        public GenericRepository<WebRoles> WebRolesRepository
        {
            get
            {
                if (this._webRoles == null)
                    this._webRoles = new GenericRepository<WebRoles>(_context);
                return _webRoles;
            }
        }

        #endregion

        #region Public member methods...
        /// <summary>
        /// Save method.
        /// </summary>
        public void Save()
        {
            _context.SaveChanges();
        }

        #endregion

        #region Public member methods for SP

        public int AddressesDelete(Nullable<int> addressId)
        {
            return _context.AddressesDelete(addressId);
        }

      
        public List<CPSearchOrderNotesByOrderNo_Result> OrderNotesByOrderNo(Nullable<int> orderNo)
        {
            List<CPSearchOrderNotesByOrderNo_Result> result = new List<CPSearchOrderNotesByOrderNo_Result>(_context.CPSearchOrderNotesByOrderNo(orderNo));
            return result;
            
        }

        public List<DocumentsSelectAll_Result> DocumentsSelectAll(Nullable<int> iD1, Nullable<int> iD2, string docType, Nullable<bool> vendorViewable, Nullable<bool> clientViewable, Nullable<bool> borrowerViewable)
        {
            List<DocumentsSelectAll_Result> result = new List<DocumentsSelectAll_Result>(_context.DocumentsSelectAll(iD1, iD2, docType, vendorViewable, clientViewable, borrowerViewable));

            return result;
        }

        public int DocumentsInsert(Nullable<int> iD1, Nullable<int> iD2, string docType, string docPath, string description, string discRefNo, Nullable<bool> clientViewable, string docSource, string enteredBy, Nullable<System.DateTime> enteredDate, Nullable<int> eventID, Nullable<bool> vendorViewable, Nullable<bool> borrowerViewable, Nullable<int> docTypeID, string documentFolder, string uidHUDLine, string uidDisbursement, Nullable<bool> lockOtherDocs, string s3KeyName, Nullable<int> tCD_RowId, Nullable<int> disbursementId)
        {
            ObjectParameter rowId = new ObjectParameter("rowId", typeof(int));
            int result = _context.DocumentsInsert(iD1, iD2, docType, docPath, description, discRefNo, clientViewable, docSource, enteredBy, enteredDate, eventID, vendorViewable, borrowerViewable, docTypeID, documentFolder, uidHUDLine, uidDisbursement, lockOtherDocs, s3KeyName, tCD_RowId, rowId, disbursementId);
            if (string.IsNullOrWhiteSpace(rowId.Value.ToString()))
            {
                return -1;
            }
            return (int)rowId.Value;
        }

        public int CPDocumentsInsert(Nullable<int> iD1, Nullable<int> iD2, string docType, string docPath, string description, string discRefNo, Nullable<bool> clientViewable, string docSource, string enteredBy, Nullable<System.DateTime> enteredDate, Nullable<int> eventID, Nullable<bool> vendorViewable, Nullable<bool> borrowerViewable, Nullable<int> docTypeID, string documentFolder, string uidHUDLine, string uidDisbursement, Nullable<bool> lockOtherDocs, string s3KeyName, Nullable<int> tCD_RowId, Nullable<int> disbursementId, Nullable<bool> uploadfromWeb, string uploadBy)
        {
            ObjectParameter rowId = new ObjectParameter("rowId", typeof(int));
            int result = _context.CPDocumentsInsert(iD1, iD2, docType, docPath, description, discRefNo, clientViewable, docSource, enteredBy, enteredDate, eventID, vendorViewable, borrowerViewable, docTypeID, documentFolder, uidHUDLine, uidDisbursement, lockOtherDocs, s3KeyName, tCD_RowId, rowId, disbursementId,uploadfromWeb,uploadBy);
            if (string.IsNullOrWhiteSpace(rowId.Value.ToString()))
            {
                return -1;
            }
            return (int)rowId.Value;
        }

        

        public List<GetStateCountyFromZip_Result> GetStateCountyFromZip(string zipcode)
        {
            List<GetStateCountyFromZip_Result> result = new List<GetStateCountyFromZip_Result>(_context.GetStateCountyFromZip(zipcode));
            return result;
        }

        public List<ContactsSelectType_Result> ContactsSelectType(Nullable<int> xRefID, string suffix)
        {
            return new List<ContactsSelectType_Result>(_context.ContactsSelectType(xRefID, suffix));
        }

        public List<DocumentTypesSelectAllByProdCat_Result> DocumentTypesSelectAllByProdCat(string productCategory, Nullable<bool> isAvailableExternal)
        {
            return new List<DocumentTypesSelectAllByProdCat_Result>(_context.DocumentTypesSelectAllByProdCat(productCategory, isAvailableExternal));
        }

        public List<OrderDetailsItemsSelect_Result> OrderDetailsItemsSelect(Nullable<int> orderNo, Nullable<bool> titleOnly, Nullable<bool> closingOnly)
        {
            return new List<OrderDetailsItemsSelect_Result>(_context.OrderDetailsItemsSelect(orderNo, titleOnly, closingOnly));
        }

        public string GetImagingSystemSelect() { 
            
            ObjectParameter ID = new ObjectParameter("ID", typeof(int));
            ObjectParameter Name = new ObjectParameter("Name", typeof(string));
            ObjectParameter DisplayName = new ObjectParameter("DisplayName", typeof(string));
            ObjectParameter ImagingURL = new ObjectParameter("URL", typeof(string));
            ObjectParameter ImagingPath = new ObjectParameter("Path", typeof(string));
            _context.ImagingSystemSelect(ID, Name, DisplayName, ImagingURL, ImagingPath);
            return ImagingPath.Value.ToString();
        }
             

        public IEnumerable<DocumentsSelectAll_Result> DocumentsSelectAll(int vId, int iId, string docType, bool vendorViewable, bool clientViewable, bool borrowerViewable)
        {
            return _context.DocumentsSelectAll(vId, iId, docType, vendorViewable, clientViewable, borrowerViewable); 
        }

     
        public IEnumerable<FeedbackPartySelectAll_Result> FeedbackPartySelectAll() 
        {
            return _context.FeedbackPartySelectAll();
        }
       

        public int  DocumentsLock(int rId,bool isLocked,string userName)
        {
            return _context.DocumentsLock(rId, isLocked, userName);
        }
        public int DocumentsDelete(int rId, string userName)
        {
            return _context.DocumentsDelete(rId, userName);
        }
       
        public List<GetCompanyGroupCodes_Result> GetCompanyGroupCodes_Result(int vendorId)
        {
            List<GetCompanyGroupCodes_Result> result =
                new List<GetCompanyGroupCodes_Result>(_context.GetCompanyGroupCodes(vendorId));

            return result;
        }
        public List<GetParentClients_Result> GetParentClients(int vid, string compantGroup) 
        {
            return new List<GetParentClients_Result>(_context.GetParentClients(vid, compantGroup));
        }
        public List<GetChildLvlClients_Result> GetChildLvlClients(int vid, string xml) 
        {
            return new List<GetChildLvlClients_Result>(_context.GetChildLvlClients(vid, xml));
        } 
       
        public int DeleteClientRestrictionsByTransId(int vendorId, string transId)
        {
            return (_context.DeleteClientRestrictionsByTransId(vendorId, transId));
        }
        public int DeleteCPRClientsByIds(int vendorId, string xml)
        {
            return (_context.DeleteCPRClientsByIds(vendorId, xml));
        }
        public int DeleteClientRestrictionsByCompanyGroupCode(int vendorId, string cgc)
        {
            return (_context.DeleteClientRestrictionsByCompanyGroupCode(vendorId, cgc));
        }
        public int DeleteCPRClientsByParentsIds(int vendorId, string xml)
        {
            return (_context.DeleteCPRClientsByParentsIds(vendorId, xml));
        }
        public List<int?> GetRPClientsByParentId(int vendorId, string xml)
        {
            return new List<int?>(_context.GetRPClientsByParentId(vendorId, xml));
        }
        public IEnumerable<GetInternalContacts_Result> GetInternalContacts(Nullable<int> orderNo, Nullable<int> itemNo)
        {
            return _context.GetInternalContacts(orderNo, itemNo);
        }
      

        public List<GetClientTransactionTypes_Result> GetClientTransactionTypes(int clientID)
        {
            return new List<GetClientTransactionTypes_Result>(_context.GetClientTransactionTypes(clientID));
        }

        public List<GetAllUserPermissionByPermissionCode_Result> GetAllUserPermissionByPermissionCode(string permissionCode)
        {
            return new List<GetAllUserPermissionByPermissionCode_Result>(_context.GetAllUserPermissionByPermissionCode(permissionCode));
        }

      
        public  List<GetUserPermissionByUserIdAndPermissionCode_Result> GetUserPermissionByUserIdAndPermissionCode(string userId, string permissionCode)
        {
            return new List<GetUserPermissionByUserIdAndPermissionCode_Result>(_context.GetUserPermissionByUserIdAndPermissionCode(userId,permissionCode));
        }

     

       public List<EventTrackingDelaysCausedBySelectAll_Result> EventTrackingDelaysCausedBySelectAll(int rowId)
       {
           return new List<EventTrackingDelaysCausedBySelectAll_Result>(_context.EventTrackingDelaysCausedBySelectAll(rowId));
       }
      

       public int DeleteInsertEventDelayCausedBy(string xml, int delayId)
       {
           return _context.DeleteInsertEventDelayCausedBy(xml, delayId);
       }

      

       public List<GetAuditLogClassAttibutes_Result> GetAuditLogClassAttibutes(string module, string className)
       {
           return new List<GetAuditLogClassAttibutes_Result>(_context.GetAuditLogClassAttibutes(module, className));
       }

       public int sysSaveAuditLog_XML_InstanceLevel(string auditLogXML, string userID, int auditTypeId, int entityPK, string instanceName)
       {
           return _context.sysSaveAuditLog_XML_InstanceLevel(auditLogXML, userID, auditTypeId, entityPK, instanceName);
       }

       public List<string> sysGetAuditLogs_XML_InstanceName(int auditTypeId, int entityPK, string instanceName, string userID)
       {
           return new List<string>(_context.sysGetAuditLogs_XML_InstanceName(auditTypeId, entityPK, instanceName, userID));
       }

        public List<ContactsSelectAll_Result> GetClientContactNames(int clientID, string suffix, bool isShowMultiLevels)
        {
            return new List<ContactsSelectAll_Result>(_context.ContactsSelectAll(clientID, suffix, isShowMultiLevels));
        }

        public List<MaritalStatusCodesSelect_Result> GetMaritalStatus()
        {
            return new List<MaritalStatusCodesSelect_Result>(_context.MaritalStatusCodesSelect());
        }

        public int SaveOrderEntry(
                        string EnteredBy, string OrderSource, string OrderOrigination, int ClientId, bool HaveAddress, bool HaveZip,
                        string StreetNo, string StreetName, string Address2, string City, string State, string Zip, string County, string LoanNo,
                        Nullable<decimal> LoanAmount, string LoanType, string PropertyType, string Note, string ContactType, string ContactName,
                        string TransactionTypesXml, string BorrowersXml
            )
        {
            ObjectParameter OrderNo = new ObjectParameter("OrderNo", typeof(int));
            
            int result = _context.CPSaveOrderEntry(EnteredBy, OrderSource, OrderOrigination, ClientId, HaveAddress,
                                    HaveZip, StreetNo, StreetName, Address2, City, State, Zip, County, LoanNo, LoanAmount, LoanType, PropertyType,
                                    Note, ContactType, ContactName, TransactionTypesXml, BorrowersXml, OrderNo);

            if (string.IsNullOrWhiteSpace(OrderNo.Value.ToString()))
            {
                return -1;
            }
            return (int)OrderNo.Value;
        }

        public int RegisterClient(string InvitationCode, string FirstName, string LastName, string Email, out string ResponseMessage, out string PasswordResetUrl,
                                    out string WebContactId, out string WebRoleId)
        {
            ObjectParameter Message = new ObjectParameter("Message", typeof(string));
            ObjectParameter Url = new ObjectParameter("Url", typeof(string));
            ObjectParameter ContactId = new ObjectParameter("ContactId", typeof(int));
            ObjectParameter RoleId = new ObjectParameter("WebRoleId", typeof(int));

            int result = _context.CPRegisterClient(InvitationCode, FirstName, LastName, Email, Message, Url, ContactId, RoleId);
            ResponseMessage = Message.Value.ToString();
            PasswordResetUrl = Url.Value.ToString();
            WebContactId = ContactId.Value.ToString();
            WebRoleId = RoleId.Value.ToString();
            return result;
        }

        public int ContactsSetRequireUserToChangePassword(int ContactId, bool RequireChangePassword)
        {
            return _context.ContactsSetRequireUserToChangePassword(ContactId, RequireChangePassword);
        }

        public bool WebChangePassword(string ContactID, string oldPassword, string newPassword, out string EmailAddress)
        {
            ObjectParameter Email = new ObjectParameter("EmailAddress", typeof(string));
            ObjectParameter success = new ObjectParameter("success", typeof(bool));

            _context.webChangePassword(ContactID, oldPassword, newPassword, success, Email);
            EmailAddress = Email.Value.ToString();
            return (bool)success.Value;
        }

      
        public int WebChangeSecretQuestion(string ContactID, int QuestionID, string Answer)
        {
            _context.webChangeSecretQuestion(ContactID, QuestionID, Answer);
            return 1;
        }

        public List<ContractOrderSearch_Result> OrderSearch(Nullable<int> MinOrderNo, Nullable<int> MaxOrderNo, Nullable<int> ClientId, string Status, string LoanNo, string AssignedUser, DateTime DisbursedDate, string BorrowerName, string City, string State, string Zip, string ProductCode, Nullable<bool> Appraisal, Nullable<bool> Title, Nullable<bool> Closing, Nullable<bool> Other, string LoanOfficer, string TransactionType, Nullable<int> ShowAllClients, Nullable<int> ShowAllChildrens, Nullable<int> IsDefaultView)
        {
            List<ContractOrderSearch_Result> result = new List<ContractOrderSearch_Result>(_context.ContractOrderSearch(MinOrderNo, MaxOrderNo, ClientId, Status, LoanNo, AssignedUser, DisbursedDate, BorrowerName, City, State, Zip, ProductCode, Appraisal, Title, Closing, Other, LoanOfficer, TransactionType, ShowAllClients, ShowAllChildrens, IsDefaultView));

            return result;
        }

        //public List<BranchesSelectAll_Result> GetAllBranches()
        //{
        //    return new List<BranchesSelectAll_Result>(_context.BranchesSelectAll());
        //}

        public List<GetClientList_Result> GetClientList(int parentID)
        {
            return new List<GetClientList_Result>(_context.GetClientList(parentID));
        }

        public List<CPOrderSearch_Result> CPOrderSearch(string BorrowerName, string LoanNo, Nullable<int> OrderNo, string LoanOfficer, string TransactionType, string Status, Nullable<int> ClientFilterVal, Nullable<int> ClientId, Nullable<bool> ShowSubClients, int DefaultPastDays)
        {
            List<CPOrderSearch_Result> result = new List<CPOrderSearch_Result>(_context.CPOrderSearch(BorrowerName, LoanNo, OrderNo, LoanOfficer, TransactionType, Status, ClientFilterVal, ClientId, ShowSubClients, DefaultPastDays));
            return result;
        }

        public List<CPOrderSummary_Result> CPOrderSummary(int OrderNo)
        {
            List<CPOrderSummary_Result> result = new List<CPOrderSummary_Result>(_context.CPOrderSummary(OrderNo));
            return result;
        }

        public List<CPGetClientList_Result> CPGetClientList(int parentID)
        {
            return new List<CPGetClientList_Result>(_context.CPGetClientList(parentID));
        }

        public List<CPGetContactNames_Result> CPGetContactNames(int lenderID)
        {
            return new List<CPGetContactNames_Result>(_context.CPGetContactNames(lenderID));
        }

        public int SavePropertyDetail(
                        string propertyType, string address1, string address1Name, string address2, string zip, string city, string county, string state,
                        string propertyDetail, Nullable<int> xRefId, string informationName, string managingAgentName, string phone,
                        string cell, string email, string stockCertificateNumber, string sharesCount, Nullable<bool> isLeaseAssigned,
                        string leaseDate, string propertyAddressSuffix, string propertyAddressType, string propertyAddress1,
                        string propertyAddress2, string propertyCity, string propertyState, string propertyZip, string propertyCounty,
                        string propertyDetailXml,string expirationDate)
            
        {
            int result = _context.CPSavePropertyDetail(propertyType, address1, address1Name, address2, zip, city, county, state, propertyDetail,
                                    xRefId, informationName, managingAgentName, phone, cell, email, stockCertificateNumber,
                                    sharesCount, isLeaseAssigned, leaseDate, propertyAddressSuffix, propertyAddressType,
                                    propertyAddress1, propertyAddress2, propertyCity, propertyState, propertyZip, propertyCounty,
                                    propertyDetailXml,expirationDate);
            return result;
        }

        public List<CPGetOrderHeader_Result> CPOrderHeader(int OrderNo)
        {
            List<CPGetOrderHeader_Result> result = new List<CPGetOrderHeader_Result>(_context.CPGetOrderHeader(OrderNo));
            return result;
        }

        public List<CPGetPropertyDetail_Result> CPGetPropertyDetail(int OrderNo)
        {
            List<CPGetPropertyDetail_Result> result = new List<CPGetPropertyDetail_Result>(_context.CPGetPropertyDetail(OrderNo));
            return result;
        }

        //public List<MaritalStatusCodesSelect_Result> GetMaritalStatus()
        //{
        //    return new List<MaritalStatusCodesSelect_Result>(_context.MaritalStatusCodesSelect());
        //}

        public void SaveOrderDetail(string OrderNumber, string LoanNumber, string PropertyType, bool ResidentType, int? NumberOfUnits, DateTime? YearPropertyAcquired,
                int? MortgageType, decimal? LoanAmount, string LoanRate, string LoanTerms, string LoanPurpose, string LoanProductType, DateTime? RateLockDate, DateTime? AnticipatedSettlementDate, string BorrowerXML, string EnteredBy)
        {
            _context.CPSaveOrderDetails(OrderNumber, LoanNumber, PropertyType, ResidentType, NumberOfUnits, YearPropertyAcquired, MortgageType, LoanAmount, LoanRate, LoanTerms, LoanPurpose, LoanProductType, RateLockDate, AnticipatedSettlementDate, BorrowerXML, EnteredBy);
        }


        public CPGetOrderDetails_Result GetOrderDetails(string OrderNumber)
        {
            return new List<CPGetOrderDetails_Result>(_context.CPGetOrderDetails(OrderNumber))[0];

        }

        public List<CPGetOrderPartyDetails_Result> GetOrderPartyDetails(string OrderNumber)
        {
            return new List<CPGetOrderPartyDetails_Result>(_context.CPGetOrderPartyDetails(OrderNumber));
        }

        public List<GetOrderDetailByOrderNo_Result> GetOrderDetailByOrderNo(int OrderNo)
        {
            return new List<GetOrderDetailByOrderNo_Result>(_context.GetOrderDetailByOrderNo(OrderNo));
        }

        public string GetProductCodeByOrder(int OrderNo)
        {
            ObjectParameter ProductCode = new ObjectParameter("ProductCode", typeof(string));

            _context.CPGetProductCodeByOrder(OrderNo, ProductCode);
            return ProductCode.Value.ToString();
        }

        public List<CPGetTitleMileStone_Result> GetTitleMileStone(int OrderNo)
        {
            return new List<CPGetTitleMileStone_Result>(_context.CPGetTitleMileStone(OrderNo));
        }

        public List<CPGetPurchaseMileStone_Result> GetPurchaseMileStone(int OrderNo)
        {
            return new List<CPGetPurchaseMileStone_Result>(_context.CPGetPurchaseMileStone(OrderNo));
        }

        public List<CPGetCOOPMileStone_Result> GetCOOPMileStone(int OrderNo)
        {
            return new List<CPGetCOOPMileStone_Result>(_context.CPGetCOOPMileStone(OrderNo));
        }

        public List<CPGetTitleCheckList_Result> GetTitleCheckList(int OrderNo)
        {
            return new List<CPGetTitleCheckList_Result>(_context.CPGetTitleCheckList(OrderNo));
        }

        public List<CPGetPurchaseCheckList_Result> GetPurchaseCheckList(int OrderNo)
        {
            return new List<CPGetPurchaseCheckList_Result>(_context.CPGetPurchaseCheckList(OrderNo));
        }

        public List<CPGetCOOPCheckList_Result> GetCOOPCheckList(int OrderNo)
        {
            return new List<CPGetCOOPCheckList_Result>(_context.CPGetCOOPCheckList(OrderNo));
        }

        public GetClientDetails_Result GetClientDetials(int ContactID)
        {
            return new List<GetClientDetails_Result>(_context.GetClientDetails(ContactID))[0];
        }

        public GetCompanyDetails_Result GetCompanyDetails(int ClientID)
        {
            return new List<GetCompanyDetails_Result>(_context.GetCompanyDetails(ClientID))[0];
        }

        public int SaveOrderStatus(int orderNo)
        {
            return _context.CPSaveOrderStatus(orderNo);
        }

        public List<CPGetRecordingDetails_Result> GetRecordingDetails(int OrderNo)
        {
            return new List<CPGetRecordingDetails_Result>(_context.CPGetRecordingDetails(OrderNo));
        }

        public List<CPGetLoanPolicyDetails_Result> GetLoanPolicyDetails(int OrderNo)
        {
            return new List<CPGetLoanPolicyDetails_Result>(_context.CPGetLoanPolicyDetails(OrderNo));
        }

        public List<CPGetPostCloseDocuments_Result> GetPostCloseDocuments(int OrderNo)
        {
            return new List<CPGetPostCloseDocuments_Result>(_context.CPGetPostCloseDocuments(OrderNo));
        }

        

        public List<CPGetTitleOrderDetails_Result> CPGetOrderTitleDetail(int OrderNo)
        {
            List<CPGetTitleOrderDetails_Result> result = new List<CPGetTitleOrderDetails_Result>(_context.CPGetTitleOrderDetails(OrderNo));
            return result;
        }

        public int CPAddTitleBillReqEvent(int OrderNo)
        {
            return _context.CPAddTitleBillReqEvent(OrderNo);
        }

        public int CPAddTitleProduct(int OrderNo)
        {
            return _context.CPAddTitleProduct(OrderNo);
        }

        public List<CPGetTitleDocumentsSelectAll_Result> CPGetTitleDocumentsSelectAll(int OrderNo)
        {
            return new List<CPGetTitleDocumentsSelectAll_Result>(_context.CPGetTitleDocumentsSelectAll(OrderNo));
        }

        public List<CPGetLeinsDetail_Result> CPGetLeinsDetail(int OrderNo)
        {
            return new List<CPGetLeinsDetail_Result>(_context.CPGetLeinsDetail(OrderNo));
        }

        public int CPAddOrderNoteInEmailQueue(int OrderNo, string Note,string NoteType)
        {
            return _context.CPAddOrderNoteInEmailQueue(OrderNo, Note, NoteType);
        }

        public List<string> GetSignatureRequirement(int OrderNo)
        {
            return new List<string>(_context.CPGetSignatureRequirement(OrderNo));
        }

        public List<CPGetPreCloseDetails_Result> GetPreCloseDetails(int OrderNo)
        {
            return new List<CPGetPreCloseDetails_Result>(_context.CPGetPreCloseDetails(OrderNo));
        }

        public List<CPGetPreCloseDocuments_Result> GetPreCloseDocuments(int OrderNo)
        {
            return new List<CPGetPreCloseDocuments_Result>(_context.CPGetPreCloseDocuments(OrderNo));
        }

        public void SavePreClose(int OrderNo, string Username, string Client, DateTime ScheduleDate, DateTime AnticipatedCloseDate, string AnticipatedCloseBy)
        {
            _context.CPSavePreCloseDetail(OrderNo, Username, Client, ScheduleDate, AnticipatedCloseDate, AnticipatedCloseBy);
        }

        public List<TCDetailsSelectAll_Result> GetClearanceItems(int OrderNo)
        {
            return new List<TCDetailsSelectAll_Result>(_context.TCDetailsSelectAll(OrderNo));
        }

        public void SaveNewYorkAttorneyItem(int OrderNo, string ClearedBy, Nullable<int> RowId)
        {
            _context.CPSaveNewYorkAttorneyItem(OrderNo, ClearedBy, RowId);
        }

        public void SaveFileClearanceRequested(int OrderNo, string ApprovalBy, string From, string To, string Subject, string Body)
        {
            _context.CPSaveFileClearanceRequested(OrderNo, ApprovalBy, From, To, Subject, Body);
        }

        public List<CPGetTCCleartoCloseDetail_Result> GetTCCleartoCloseDetail(int OrderNo)
        {
            return new List<CPGetTCCleartoCloseDetail_Result>(_context.CPGetTCCleartoCloseDetail(OrderNo));
        }

        public List<CPGetPermissionsAgainstRole_Result> CPGetPermissionsAgainstRole(int RoleId, string ScreenName)
        {
            List<CPGetPermissionsAgainstRole_Result> result = new List<CPGetPermissionsAgainstRole_Result>(_context.CPGetPermissionsAgainstRole(RoleId,ScreenName));

            return result;
        }

        public List<CPGetSecurityFormControls_Result> CPGetSecurityFormControls(int ApplicationId)
        {
            List<CPGetSecurityFormControls_Result> result = new List<CPGetSecurityFormControls_Result>(_context.CPGetSecurityFormControls(ApplicationId));
            return result;
        }

        public List<CPGetSecurityFormControlsConfig_Result> CPGetSecurityFormControlsConfig(int ApplicationId)
        {
            List<CPGetSecurityFormControlsConfig_Result> result = new List<CPGetSecurityFormControlsConfig_Result>(_context.CPGetSecurityFormControlsConfig(ApplicationId));
            return result;
        }

        public int CPDeleteSecurityControl(int securityControlId)
        {
            return _context.CPDeleteSecurityControl(securityControlId);
        }

        public int CPDeleteSecurityForm(int securityFormId)
        {
            return _context.CPDeleteSecurityForm(securityFormId);
        }

        public int CPDeleteSecurityFormControl(int securityFormControlId)
        {
            return _context.CPDeleteSecurityFormControl(securityFormControlId);
        }

        public List<CPGetDownloadDocumentList_Result> CPGetDownloadDocumentList()
        {
            return new List<CPGetDownloadDocumentList_Result>(_context.CPGetDownloadDocumentList());
        }

        public int EmailQueueInsert(string From, string To, string Subject, string Body, string Attachment)
        {
            ObjectParameter Id = new ObjectParameter("RowId", typeof(int));
            _context.EmailQueueInsert(Id, From, To, Subject, Body, Attachment);

            return int.Parse(Id.Value.ToString());
        }


        public bool ValidateUserEmail(string emailAddress, out string otContactID)
        {
            ObjectParameter contactID = new ObjectParameter("oiContactId", typeof(int));
            ObjectParameter success = new ObjectParameter("obSuccess", typeof(bool));

            _context.CPVaidateUserEmail(emailAddress , contactID , success);
            otContactID = contactID.Value.ToString();
            return (bool)success.Value;
        
        }

        

        public int GetRegisterUserDetails(string InvitationCode, int XRefId, string Suffix, out int WebClientId, out int WebRoleId, out int SequenceNo, out int WebContactId)
        {
            ObjectParameter ClientId = new ObjectParameter("ClientId", typeof(int));
            ObjectParameter RoleId = new ObjectParameter("WebRoleId", typeof(int));
            ObjectParameter Sequence = new ObjectParameter("SequenceNo", typeof(int));
            ObjectParameter ContactId = new ObjectParameter("ContactId", typeof(int));

            int result = _context.CPGetRegisterUserDetails(InvitationCode, XRefId, Suffix, ClientId, RoleId, Sequence, ContactId);

            if (ClientId.Value.ToString() != "")
                WebClientId = int.Parse(ClientId.Value.ToString());
            else
                WebClientId = 0;
            if (RoleId.Value.ToString() != "")
                WebRoleId = int.Parse(RoleId.Value.ToString());
            else
                WebRoleId = 0;
            SequenceNo = int.Parse(Sequence.Value.ToString());
            if (ContactId.Value.ToString() != "")
                WebContactId = int.Parse(ContactId.Value.ToString());
            else
                WebContactId = 0;
            return result;
        }

        public int WebUserRolesUpdate(int ContactId, int RoleId)
        {
            return _context.webUserRolesUpdate(ContactId, RoleId);
        }

        public List<CPTCRequestQuestionsAnswered_Result> TCRequestQuestionsAnswered(int OrderNo, string RequestType)
        {
            return new List<CPTCRequestQuestionsAnswered_Result>(_context.CPTCRequestQuestionsAnswered(OrderNo, RequestType));
        }

        public List<CPGetAccountProfile_Result> GetAccountProfile(int ContactId)
        {
            return new List<CPGetAccountProfile_Result>(_context.CPGetAccountProfile(ContactId));
        }

        #endregion

        #region Implementing IDiosposable...

        #region private dispose variable declaration...
        private bool disposed = false;
        #endregion

        /// <summary>
        /// Protected Virtual Dispose method
        /// </summary>
        /// <param name="disposing"></param>
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    Debug.WriteLine("UnitOfWork is being disposed");
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        /// <summary>
        /// Dispose method
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}
