using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class PropertyDetailRequest
    {
        [Required]
        public string PropertyType { get; set; }
        [Required]
        public string Address1 { get; set; }
        [Required]
        public string Address1Name { get; set; }

        public string Address2 { get; set; }
        public string zip { get; set; }
        public string city { get; set; }
        public string county { get; set; }
        public string state { get; set; }
        public string PropertyDetail { get; set; }

        [Required]
        public int XRefId { get; set; }
        public string InformationName { get; set; }
        public string ManagingAgentName { get; set; }
        public string Phone { get; set; }
        public string Cell { get; set; }
        public string Email { get; set; }
        public string StockCertificateNumber { get; set; }
        public string SharesCount { get; set; }
        public bool IsLeaseAssigned { get; set; }
        public string LeaseDate { get; set; }

        public string ExpirationDate { get; set; }
        public string PropertyAddressSuffix { get; set; }
        public string PropertyAddressType { get; set; }
        public string PropertyAddress1 { get; set; }
        public string PropertyAddress2 { get; set; }
        public string PropertyCity { get; set; }
        public string PropertyState { get; set; }
        public string PropertyZip { get; set; }
        public string PropertyCounty { get; set; }
        
        public List<PropertyDetailEntity> PropertyDetailList { get; set; }
    }
}
