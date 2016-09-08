﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models
{
    public class GetClientList_ResultEntity
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Alias { get; set; }
        public string NameAliasCalc { get; set; }
        public string ClientType { get; set; }
        public System.DateTime CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<int> MainAddressId { get; set; }
        public bool SvcAppraisals { get; set; }
        public bool SvcTitles { get; set; }
        public bool SvcClosings { get; set; }
        public bool SvcOther { get; set; }
        public bool Inactive { get; set; }
        public Nullable<System.DateTime> InactiveDate { get; set; }
        public bool OutOfBusiness { get; set; }
        public bool BoughtByAnother { get; set; }
        public string NewLenderName { get; set; }
        public string TimeZone { get; set; }
        public string PaymentTerms { get; set; }
        public decimal PurchaseTotalDue { get; set; }
        public string CollectionStatus { get; set; }
        public string BillingMethod { get; set; }
        public string StatementDelivery { get; set; }
        public Nullable<System.DateTime> LastPurchaseDate { get; set; }
        public decimal LastPurchaseAmount { get; set; }
        public decimal YTDPurchases { get; set; }
        public string PurchaseCheckNo { get; set; }
        public string PurchaseInvoiceNo { get; set; }
        public Nullable<System.DateTime> LastPaymentDate { get; set; }
        public decimal LastPaymentAmount { get; set; }
        public decimal YTDPayments { get; set; }
        public string PaymentCheckNo { get; set; }
        public string PaymentInvoiceNo { get; set; }
        public string WebURL { get; set; }
        public bool RoleLender { get; set; }
        public bool RoleBroker { get; set; }
        public bool RoleOther { get; set; }
        public bool ECommerce { get; set; }
        public bool AppFull { get; set; }
        public bool AppOnTheFly { get; set; }
        public bool AppWorkFlow { get; set; }
        public bool TtlFull { get; set; }
        public bool TtlOnTheFly { get; set; }
        public bool TtlWorkFlow { get; set; }
        public bool ClsFull { get; set; }
        public bool ClsOnTheFly { get; set; }
        public bool ClsWorkFlow { get; set; }
        public string MIS_BranchId { get; set; }
        public string MIS_Dept { get; set; }
        public string MIS_ClientId { get; set; }
        public Nullable<int> DefAppProcId { get; set; }
        public Nullable<int> DefTtlProcId { get; set; }
        public Nullable<int> DefClsProcId { get; set; }
        public Nullable<int> DefOthProcId { get; set; }
        public bool TransferredToOracle { get; set; }
        public bool AutoAssign { get; set; }
        public Nullable<int> ParentId { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }
        public byte[] SysTimeStamp { get; set; }
        public string TitleEscrowId { get; set; }
        public string TitleEscrowTemplate { get; set; }
        public Nullable<int> DefaultHUDTemplateID { get; set; }
        public bool IsIsolated { get; set; }
        public Nullable<decimal> PreviousYearPurchases { get; set; }
        public Nullable<decimal> PreviousYearPayments { get; set; }
        public Nullable<bool> AllowOnlineUserRegistration { get; set; }
        public Nullable<int> UserRegistrationRoleId { get; set; }
        public Nullable<int> PreferredPasswordLength { get; set; }
        public Nullable<int> MinimumNumericCharacters { get; set; }
        public Nullable<int> MinimumSymbolCharacters { get; set; }
        public Nullable<int> MinimumSymbolOrNumericCharacters { get; set; }
        public bool RequiresUpperAndLowerCaseCharacters { get; set; }
        public Nullable<int> FailedLoginAttemptsAllowed { get; set; }
        public Nullable<int> PasswordExpireDays { get; set; }
        public string RptTypeSchedConfirmation { get; set; }
        public Nullable<bool> FlgReportToAccounting { get; set; }
        public string PageTheme { get; set; }
        public string DefaultSubject { get; set; }
        public string PartyId { get; set; }
        public string IntegrationProvider { get; set; }
        public Nullable<bool> IntegrationIsPrimary { get; set; }
        public Nullable<System.DateTime> OpenTime { get; set; }
        public Nullable<System.DateTime> CloseTime { get; set; }
        public Nullable<bool> InheritTimesFromParent { get; set; }
        public string CompanyGroupCode { get; set; }
        public Nullable<int> LOB { get; set; }
        public Nullable<int> Sage_Key { get; set; }
        public bool AutoClear { get; set; }
        public bool AutoClearEntireOrder { get; set; }
        public bool AutoClearFamilyPayoffOnly { get; set; }
        public bool AutoClearanceNote { get; set; }
        public string SageSegmentCode { get; set; }
        public Nullable<bool> PlatinumLoan { get; set; }
        public int SchedulingSLA { get; set; }
        public Nullable<bool> IntegratedScheduling { get; set; }
        public Nullable<bool> IsPlatinumClient { get; set; }
        public int isModulePermission { get; set; }
    }
}
