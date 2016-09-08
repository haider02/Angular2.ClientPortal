using System.Collections.Generic;
using System.Linq;
using System.Xml;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel;
using MC.DataModel.UnitOfWork;
using MC.Common.Encryption;

namespace MC.BusinessServices.ClientPortal
{
    public class OrderEntryService : IOrderEntryService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public OrderEntryService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public List<GetClientTransactionTypes_ResultEntity> GetClientTransactionTypes(int clientId)
        {
            List<GetClientTransactionTypes_Result> result = _unitOfWork.GetClientTransactionTypes(clientId);
            if (result.Any())
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<GetClientTransactionTypes_Result, GetClientTransactionTypes_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<GetClientTransactionTypes_Result>, List<GetClientTransactionTypes_ResultEntity>>(result);
                return data;
            }
            return new List<GetClientTransactionTypes_ResultEntity>();
        }

        public List<GetClientContactNames_ResultEntity> GetClientContactNames(int clientId, string suffix, bool isShowMultiLevels)
        {            
            List<CPGetContactNames_Result> result = _unitOfWork.CPGetContactNames(clientId);
            if (result.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetContactNames_Result, GetClientContactNames_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetContactNames_Result>, List<GetClientContactNames_ResultEntity>>(result);
                return data;
            }
            return new List<GetClientContactNames_ResultEntity>();
        }

        public List<GetMaritalStatus_ResultEntity> GetMaritalStatus()
        {
            List<MaritalStatusCodesSelect_Result> result = _unitOfWork.GetMaritalStatus();
            if (result.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<MaritalStatusCodesSelect_Result, GetMaritalStatus_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<MaritalStatusCodesSelect_Result>, List<GetMaritalStatus_ResultEntity>>(result);
                return data;
            }
            return new List<GetMaritalStatus_ResultEntity>();
        }

        public int SaveOrderEntry(OrderEntryDetailRequest request)
        {
            
            foreach (BorrowersEntity item in request.BorrowerList)
            {            
                if (item.SSN != "")
                    item.SSN = EncryptDecrypt.EncryptString(item.SSN);
                item.Password = EncryptDecrypt.EncryptString("YW_" + item.LastName);
            }

            XmlElement listElement1 = GetTransactionTypeList(request);
            XmlElement listElement2 = GetBorrowerList(request);
            
            int orderNo = _unitOfWork.SaveOrderEntry(request.EnteredBy, request.OrderSource, request.OrderOrigination, request.ClientId, request.HaveAddress,
                request.HaveZip, request.StreetNo, request.StreetName, request.Address2, request.City, request.State, request.Zip, request.County,
                request.LoanNo, request.LoanAmount, request.LoanType, request.PropertyType, request.Note, request.ContactType, request.ContactName,
                listElement1.OuterXml, listElement2.OuterXml);

            return orderNo;
        }

        private XmlElement GetTransactionTypeList(OrderEntryDetailRequest request)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlElement rootElement = xmlDoc.CreateElement("TransactionTypeList");
            if (request.TransactionTypeList != null && request.TransactionTypeList.Count > 0)
            {
                foreach (var item in request.TransactionTypeList)
                {
                    XmlElement tableElement = xmlDoc.CreateElement("TransactionTypes");

                    XmlAttribute columnAttribute1 = GetAttribute("ClientContactId", item.ClientContactId.ToString(), xmlDoc);
                    XmlAttribute columnAtrribute2 = GetAttribute("ProductCode", item.ProductCode, xmlDoc);
                    XmlAttribute columnAtrribute3 = GetAttribute("ProductCategory", item.ProductCategory, xmlDoc);
                    XmlAttribute columnAtrribute4 = GetAttribute("BranchId", item.BranchId, xmlDoc);
                    XmlAttribute columnAtrribute5 = GetAttribute("ClientRefNo", item.ClientRefNo, xmlDoc);
                    XmlAttribute columnAtrribute6 = GetAttribute("Status", item.Status, xmlDoc);
                    XmlAttribute columnAtrribute7 = GetAttribute("ManualAssignEnabled", item.ManualAssignEnabled.ToString(), xmlDoc);
                    XmlAttribute columnAtrribute8 = GetAttribute("ShowOnOrderWIP", item.ShowOnOrderWIP.ToString(), xmlDoc);
                    XmlAttribute columnAtrribute9 = GetAttribute("ClientBundleID", item.ClientBundleID.ToString(), xmlDoc);
                    XmlAttribute columnAtrribute10 = GetAttribute("BundleDetailsID", item.BundleDetailsID.ToString(), xmlDoc);
                    XmlAttribute columnAtrribute11 = GetAttribute("Ordered", item.Ordered.ToString(), xmlDoc);

                    tableElement.Attributes.Append(columnAttribute1);
                    tableElement.Attributes.Append(columnAtrribute2);
                    tableElement.Attributes.Append(columnAtrribute3);
                    tableElement.Attributes.Append(columnAtrribute4);
                    tableElement.Attributes.Append(columnAtrribute5);
                    tableElement.Attributes.Append(columnAtrribute6);
                    tableElement.Attributes.Append(columnAtrribute7);
                    tableElement.Attributes.Append(columnAtrribute8);
                    tableElement.Attributes.Append(columnAtrribute9);
                    tableElement.Attributes.Append(columnAtrribute10);
                    tableElement.Attributes.Append(columnAtrribute11);

                    rootElement.AppendChild(tableElement);
                }
            }

            return rootElement;
        }

        private XmlElement GetBorrowerList(OrderEntryDetailRequest request)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlElement rootElement = xmlDoc.CreateElement("BorrowerList");
            if (request.BorrowerList != null && request.BorrowerList.Count > 0)
            {
                foreach (var item in request.BorrowerList)
                {
                    XmlElement tableElement = xmlDoc.CreateElement("Borrowers");

                    XmlAttribute columnAttribute1 = GetAttribute("OrderNo", item.OrderNo.ToString(), xmlDoc);
                    XmlAttribute columnAttribute2 = GetAttribute("EnteredBy", item.EnteredBy, xmlDoc);
                    XmlAttribute columnAttribute3 = GetAttribute("LastModBy", item.LastModBy, xmlDoc);
                    XmlAttribute columnAttribute4 = GetAttribute("Type", item.Type, xmlDoc);
                    XmlAttribute columnAttribute5 = GetAttribute("FullName", item.FullName, xmlDoc);
                    XmlAttribute columnAttribute6 = GetAttribute("HomePhone", item.HomePhone, xmlDoc);
                    XmlAttribute columnAttribute7 = GetAttribute("CellPhone", item.CellPhone, xmlDoc);
                    XmlAttribute columnAttribute8 = GetAttribute("Email", item.Email, xmlDoc);
                    XmlAttribute columnAttribute9 = GetAttribute("SSN", item.SSN, xmlDoc);
                    XmlAttribute columnAttribute10 = GetAttribute("MaritalStatusId", item.MaritalStatusId.ToString(), xmlDoc);
                    XmlAttribute columnAttribute11 = GetAttribute("FirstName", item.FirstName, xmlDoc);
                    XmlAttribute columnAttribute12 = GetAttribute("LastName", item.LastName, xmlDoc);
                    XmlAttribute columnAttribute13 = GetAttribute("Password", item.Password, xmlDoc);

                    tableElement.Attributes.Append(columnAttribute1);
                    tableElement.Attributes.Append(columnAttribute2);
                    tableElement.Attributes.Append(columnAttribute3);
                    tableElement.Attributes.Append(columnAttribute4);
                    tableElement.Attributes.Append(columnAttribute5);
                    tableElement.Attributes.Append(columnAttribute6);
                    tableElement.Attributes.Append(columnAttribute7);
                    tableElement.Attributes.Append(columnAttribute8);
                    tableElement.Attributes.Append(columnAttribute9);
                    tableElement.Attributes.Append(columnAttribute10);
                    tableElement.Attributes.Append(columnAttribute11);
                    tableElement.Attributes.Append(columnAttribute12);
                    tableElement.Attributes.Append(columnAttribute13);

                    rootElement.AppendChild(tableElement);
                }
            }

            return rootElement;
        }

        private XmlAttribute GetAttribute(string attributeName, string attributeValue, XmlDocument xmlDoc)
        {
            XmlAttribute attribute = xmlDoc.CreateAttribute(attributeName);
            attribute.Value = attributeValue;
            return attribute;
        }
    }
}
