using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices
{
    public interface IOrderNotesService
    {
        IEnumerable<OrderNotesEntity> GetOrderNotesByOrderNo(int orderNo);
        bool SaveOrderNotes(OrderNotesEntity noteData);
        int CpAddOrderNoteInEmailQueue(int orderNo, string note, string noteType);
    }
}
