using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MC.BusinessEntities.Models;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models
{
    public class AddressEntity
    {
        [Required]
        public int AddressId { get; set; }
        [Required]
        public int XRefId { get; set; }

        [Required]
        public string Suffix { get; set; }
        [Required]
        public string AddressType { get; set; }
        [Required]
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string city { get; set; }
        public string State { get; set; }
        public string County { get; set; }
        public string CountyCode { get; set; }
        public string Zip { get; set; }
        public string ZipPlusFour { get; set; }
        public string Attention { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public System.DateTime LastModDate { get; set; }
        public string LastModBy { get; set; }
        public byte[] SysTimeStamp { get; set; }
        public Nullable<double> Latitude { get; set; }
        public Nullable<double> Longitude { get; set; }
        public string AutoAttendant { get; set; }
        public Nullable<int> cdfAddressID { get; set; }
        public string Cell { get; set; }
        public string Description { get; set; }
    }
}
