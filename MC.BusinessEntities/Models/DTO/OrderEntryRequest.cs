using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MC.BusinessEntities.Models.DTO
{
    public class OrderEntryRequest
    {
        public int ClientID { get; set; }
        public string Suffix { get; set; }
        public bool ShowMultiLevels { get; set; }
        //public int ID { get; set; }
        //public int VendorId { get; set; }
        //public string Category { get; set; }
        //public string Method { get; set; }
        //public string CommunicateWith { get; set; }
        //public string Comments { get; set; }
        //public string CreatedBy { get; set; }
        //public System.DateTime CreatedDate { get; set; }
        //public System.DateTime LastModDate { get; set; }
        //public string LastModBy { get; set; }
        //public string OrderNo { get; set; }
        //public Nullable<int> EventTrackingDelayId { get; set; }
        //public Nullable<System.DateTime> FollowupDate { get; set; }
        //public bool InActive { get; set; }
    }
}
