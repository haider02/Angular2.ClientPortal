using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class OrderDetailRequestDTO
    {

        public List<GetOrderPartyDetailsEntity> PartyList { get; set; }

        public GetOrderDetailsEntity OrderMaster { get; set; }



    }
}
