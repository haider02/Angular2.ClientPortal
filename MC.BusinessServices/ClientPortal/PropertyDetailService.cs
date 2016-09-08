using System.Collections.Generic;
using System.Linq;
using System.Xml;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices.ClientPortal
{
    public class PropertyDetailService : IPropertyDetailService
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public PropertyDetailService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public List<GetPropertyDetail_ResultEntity> CpGetPropertyDetail(int orderNo)
        {
            List<CPGetPropertyDetail_Result> result = _unitOfWork.CPGetPropertyDetail(orderNo);
            if (result.Any())
            {                
                var config = new MapperConfiguration(cfg => cfg.CreateMap<CPGetPropertyDetail_Result, GetPropertyDetail_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<CPGetPropertyDetail_Result>, List<GetPropertyDetail_ResultEntity>>(result);
                return data;
            }
            return new List<GetPropertyDetail_ResultEntity>();
        }

        public int SavePropertyDetail(PropertyDetailRequest request)
        {
            XmlElement listElement = GetPropertyDetailList(request);
            
            _unitOfWork.SavePropertyDetail(request.PropertyType, request.Address1, request.Address1Name, request.Address2, request.zip, request.city, request.county,
                            request.state, request.PropertyDetail, request.XRefId, request.InformationName, request.ManagingAgentName,
                            request.Phone, request.Cell, request.Email, request.StockCertificateNumber, request.SharesCount, request.IsLeaseAssigned,
                            request.LeaseDate, request.PropertyAddressSuffix, request.PropertyAddressType, request.PropertyAddress1,
                            request.PropertyAddress2, request.PropertyCity, request.PropertyState, request.PropertyZip, request.PropertyCounty,
                            listElement.OuterXml, request.ExpirationDate);

            return 1;
        }
        
        private XmlElement GetPropertyDetailList(PropertyDetailRequest request)
        {
            XmlDocument xmlDoc = new XmlDocument();
            XmlElement rootElement = xmlDoc.CreateElement("PropertyDetailList");
            if (request.PropertyDetailList != null && request.PropertyDetailList.Count > 0)
            {
                foreach (var item in request.PropertyDetailList)
                {
                    XmlElement tableElement = xmlDoc.CreateElement("PropertyDetail");

                    tableElement.Attributes.Append(GetAttribute("RowId", item.RowId, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("CreatedDate", item.CreatedDate, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("CreatedBy", item.CreatedBy, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyDetail", item.PropertyDetail, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("InformationName", item.InformationName, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("ManagingAgentName", item.ManagingAgentName, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("Phone", item.Phone, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("Cell", item.Cell, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("Email", item.Email, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PhoneWithDash", item.PhoneWithDash, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("CellWithDash", item.CellWithDash, xmlDoc));

                    tableElement.Attributes.Append(GetAttribute("StockCertificateNumber", item.StockCertificateNumber, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SharesCount", item.SharesCount, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("IsLeaseAssigned", item.IsLeaseAssigned, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("LeaseDate", item.LeaseDate, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("ExpirationDate", item.ExpirationDate, xmlDoc));

                    tableElement.Attributes.Append(GetAttribute("PropertyAddressSuffix", item.PropertyAddressSuffix, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyAddressType", item.PropertyAddressType, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyAddress1", item.PropertyAddress1, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyAddress2", item.PropertyAddress2 != null ? item.PropertyAddress2 : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyCity", item.PropertyCity != null ? item.PropertyCity : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyState", item.PropertyState != null ? item.PropertyState : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyZip", item.PropertyZip != null ? item.PropertyZip : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("PropertyCounty", item.PropertyCounty != null ? item.PropertyCounty : "", xmlDoc));

                    tableElement.Attributes.Append(GetAttribute("BuyerAddressSuffix", item.BuyerAddressSuffix, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("BuyerAddressType", item.BuyerAddressType, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("BuyerAddress1", item.BuyerAddress1, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("BuyerAddress2", item.BuyerAddress2, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("BuyerCity", item.BuyerCity != null ? item.BuyerCity : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("BuyerState", item.BuyerState != null ? item.BuyerState : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("BuyerZip", item.BuyerZip != null ? item.BuyerZip : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("BuyerCounty", item.BuyerCounty != null ? item.BuyerCounty : "", xmlDoc));

                    tableElement.Attributes.Append(GetAttribute("SellerAddressSuffix", item.SellerAddressSuffix, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SellerAddressType", item.SellerAddressType, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SellerAddress1", item.SellerAddress1, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SellerAddress2", item.SellerAddress2, xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SellerCity", item.SellerCity != null ? item.SellerCity : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SellerState", item.SellerState != null ? item.SellerState : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SellerZip", item.SellerZip != null ? item.SellerZip : "", xmlDoc));
                    tableElement.Attributes.Append(GetAttribute("SellerCounty", item.SellerCounty != null ? item.SellerCounty : "", xmlDoc));

                    tableElement.Attributes.Append(GetAttribute("IsActive", item.IsActive.ToString(), xmlDoc));

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
