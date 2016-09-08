using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices
{
    public interface  IReferenceDataServices
    {
        IEnumerable<ComboEntryEntity> GetComboEntityByCboId(string cboId);

        IEnumerable<OrderDetailsItemsSelect_ResultEntity> OrderDetailsItemsSelect();

        IEnumerable<DocumentTypesSelectAllByProdCat_ResultEntity> DocumentTypesSelectAllByProdCat(string docTypeCat);
        
        IEnumerable<ComboEntryEntity> GetComboEntityByRowId(string rowId);

    }
}
