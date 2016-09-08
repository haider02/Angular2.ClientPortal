using System.Collections.Generic;
using MC.BusinessEntities.Models;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices
{
    public interface IDocumentServices
    {
        DocumentEntity GetDocumentByDocumentId(int keyId);
        IEnumerable<DocumentsSelectAll_ResultEntity> GetDocumentsById(int keyId);
        IEnumerable<DocumentEntity> GetAllDocuments();
        int CreateDocuments(DocumentEntity modelEntity, string filePath, string fileName);
        bool UpdateDocument(int keyId, DocumentEntity modelEntity);
        bool DeleteDocument(int keyId);

        bool DeleteDocuments(List<int> documentIds, string lastModifiedBy);
        bool LockDocuments(List<int> documentIds, bool islock, string username);
        string GetImagingSystemSelect();

        IEnumerable<OrderDetailDTO> GetOrderDetailByOrderNo(int orderNo);
    }
}
