using System.Collections.Generic;
using System.Linq;
using System.Xml;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using MC.Common.Encryption;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly UnitOfWork _unitOfWork;        

        public OrderDetailService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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

        public void SaveOrderDetail(OrderDetailRequestDTO request)
        {
            foreach (GetOrderPartyDetailsEntity item in request.PartyList)
            {                
                if (item.SSN != "")
                    item.SSN = EncryptDecrypt.EncryptString(item.SSN);             
            }

            XmlElement listElement2 = GetBorrowerList(request);

            var orderMaster = request.OrderMaster;
            _unitOfWork.SaveOrderDetail(orderMaster.OrderNo.ToString(), orderMaster.LoanNo, orderMaster.PropertyType,orderMaster.NonOwnerOccupied, orderMaster.NumberofUnits, orderMaster.PropertyAcquiredDate,
                orderMaster.LoanCategory, orderMaster.LoanAmount, orderMaster.LoanRate, orderMaster.LoanTerm,orderMaster.LoanPurpose, orderMaster.LoanProductType, orderMaster.RateLockDate, orderMaster.AnticipatedSettlementDate, listElement2.OuterXml, orderMaster.EnteredBy);
        }

        public GetOrderDetailsEntity GetOrderDetails(string orderNumber)
        {
            var orderDetail = _unitOfWork.GetOrderDetails(orderNumber);
            if (orderDetail != null)
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetOrderDetails_Result, GetOrderDetailsEntity>());
                var mapper = config.CreateMapper();
                GetOrderDetailsEntity data = mapper.Map<CPGetOrderDetails_Result, GetOrderDetailsEntity>(orderDetail);
                return data;
            }
            return null;
        }


        public IEnumerable<GetOrderPartyDetailsEntity> GetOrderPartyDetails(string orderNumber)
        {
            var orderPartyDetail = _unitOfWork.GetOrderPartyDetails(orderNumber).ToList();
            if (orderPartyDetail.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetOrderPartyDetails_Result, GetOrderPartyDetailsEntity>());
                var mapper = config.CreateMapper();
                var orderPartyDetailModel = mapper.Map<IList<CPGetOrderPartyDetails_Result>, IList<GetOrderPartyDetailsEntity>>(orderPartyDetail);
                

                foreach (GetOrderPartyDetailsEntity item in orderPartyDetailModel)
                {
                    if (item.SSN != "")
                        item.SSN = EncryptDecrypt.DecryptString(item.SSN);
                }

                return orderPartyDetailModel;
            }
            return null;
        }
       


        private XmlElement GetBorrowerList(OrderDetailRequestDTO request)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlElement rootElement = xmlDoc.CreateElement("BorrowerList");
            if (request.PartyList != null && request.PartyList.Count > 0)
            {
                foreach (var item in request.PartyList)
                {
                    XmlElement tableElement = xmlDoc.CreateElement("Borrowers");

                    XmlAttribute columnAttribute1 = GetAttribute("OrderNo", item.OrderNo.ToString(), xmlDoc);
                    XmlAttribute columnAttribute2 = GetAttribute("EnteredBy", item.EnteredBy, xmlDoc);
                    XmlAttribute columnAttribute3 = GetAttribute("LastModBy", item.LastModBy, xmlDoc);
                    XmlAttribute columnAttribute4 = GetAttribute("Type", item.Type, xmlDoc);
                    XmlAttribute columnAttribute5 = GetAttribute("FullName", item.FullName, xmlDoc);
                    XmlAttribute columnAttribute6 = GetAttribute("HomePhone", item.HomePhone == null ? "" : item.HomePhone, xmlDoc);
                    XmlAttribute columnAttribute7 = GetAttribute("CellPhone", item.CellPhone == null ? "" : item.CellPhone, xmlDoc);
                    XmlAttribute columnAttribute8 = GetAttribute("Email", item.Email== null ? "" :  item.Email, xmlDoc);
                    XmlAttribute columnAttribute9 = GetAttribute("SSN", item.SSN == null ? "" : item.SSN, xmlDoc);
                    XmlAttribute columnAttribute10 = GetAttribute("MaritalStatusId", item.MaritalStatusId == null ? "-1" : item.MaritalStatusId.ToString(), xmlDoc);
                    XmlAttribute columnAttribute11 = GetAttribute("FirstName", item.FirstName == null ? "" : item.FirstName, xmlDoc);
                    XmlAttribute columnAttribute12 = GetAttribute("LastName", item.LastName==null ? "" : item.LastName, xmlDoc);
                    XmlAttribute columnAttribute13 = GetAttribute("SequenceNo", item.SequenceNo.ToString(), xmlDoc);
                    XmlAttribute columnAttribute14 = GetAttribute("BorrowerId", item.BorrowerId.ToString(), xmlDoc);

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
                    tableElement.Attributes.Append(columnAttribute14);

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
