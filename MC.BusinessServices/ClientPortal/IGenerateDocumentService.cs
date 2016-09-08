using System.Collections.Generic;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices.ClientPortal
{
    public interface IGenerateDocumentService
    {
        List<GenerateDocumentDTO> GetNyDocumentList();
    }
}
