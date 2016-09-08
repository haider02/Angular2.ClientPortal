using System.Collections.Generic;

namespace MC.BusinessServices.ClientPortal
{
    public interface IPostCloseService
    {
        IEnumerable<object> GetRecordingDetails(int orderNo);
        IEnumerable<object> GetLoanPolicyDetails(int orderNo);
        IEnumerable<object> GetPostCloseDocuments(int orderNo);
    }
}
