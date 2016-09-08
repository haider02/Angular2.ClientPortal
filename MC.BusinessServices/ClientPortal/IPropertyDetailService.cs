using System.Collections.Generic;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IPropertyDetailService
    {
        int SavePropertyDetail(PropertyDetailRequest request);        
        List<GetPropertyDetail_ResultEntity> CpGetPropertyDetail(int orderNo);
    }
}
