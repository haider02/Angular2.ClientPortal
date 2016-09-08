using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;
using System.Text;
using System.IO;
using MC.BusinessEntities.Models.DTO;

namespace MC.BusinessServices
{
    /// <summary>
    /// Documents Related service/CRUD and business operations
    /// </summary>
    public class DocumentServices : IDocumentServices
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// public constructor to construct Unit of work
        /// </summary>
        /// <param name="unitOfWork"></param>
        public DocumentServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Create document entity
        /// </summary>
        /// <param name="modelEntity"></param>
        /// <param name="filePath"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public int CreateDocuments(DocumentEntity modelEntity, string filePath, string fileName)
        {
            using (var scope = new TransactionScope())
            {
                modelEntity.DocPath = SaveFileName(filePath, fileName, modelEntity.ID1.ToString());
                int result;
                try
                {
                    result= _unitOfWork.CPDocumentsInsert(modelEntity.ID1, modelEntity.ID2, modelEntity.DocType, modelEntity.DocPath, modelEntity.Description, modelEntity.DiscRefNo,
                    modelEntity.ClientViewable, modelEntity.DocSource, modelEntity.EnteredBy, DateTime.Now.Date, modelEntity.EventId, modelEntity.VendorViewable,
                    modelEntity.BorrowerViewable, modelEntity.DocTypeID, modelEntity.DocumentFolder,
                    modelEntity.uidHUDLine.HasValue ? modelEntity.uidHUDLine.Value.ToString() : null,
                    modelEntity.uidDisbursement.HasValue ? modelEntity.uidDisbursement.Value.ToString() : null,
                    modelEntity.IsLocked, modelEntity.S3KeyName, modelEntity.TCD_RowId, modelEntity.DisbursementID,modelEntity.UploadfromWeb,modelEntity.UploadBy);
                    
                }
                catch (Exception)
                {
                    throw new Exception("Save failed in DB");
                }
                
                scope.Complete();
                return result;
            }
        }

        private string SaveFileName(string filePath, string fileName, string id1)
        {
            string path;

            string imagingPath = _unitOfWork.GetImagingSystemSelect();

            StringBuilder output = new StringBuilder(64);
            char charDir = Path.DirectorySeparatorChar;
            string id1Padded = id1.PadLeft(8, '0');
            output.Append("Vendor");
            output.Append(charDir);
            output.Append(id1Padded.Substring(0, 4));
            output.Append(charDir);
            output.Append(id1Padded);
            output.Append(charDir);
            path = Path.Combine(imagingPath, output.ToString());
            path = Path.Combine(path, fileName);
            FileInfo fi = new FileInfo(path);
            int i = 0;

            string pathSansExt = fi.FullName.Replace(fi.Extension, "");
            string extension = fi.Extension;

            while (fi.Exists)
            {
                i++;

                path = pathSansExt + "." + i + extension;

                fi = new FileInfo(path);
            }                
            if (!Directory.Exists(fi.DirectoryName))
            {
                Directory.CreateDirectory(fi.DirectoryName);
            }
            File.Move(filePath, path);
            return path;                
        }

        /// <summary>
        /// Delete document entity
        /// </summary>
        /// <param name="keyId"></param>
        /// <returns></returns>
        public bool DeleteDocument(int keyId)
        {
            var success = false;
            if (keyId > 0)
            {
                using (var scope = new TransactionScope())
                {
                    var document = _unitOfWork.DocumentRepository.GetByID(keyId);
                    if (document != null)
                    {

                        _unitOfWork.DocumentRepository.Delete(document);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }

        public bool DeleteDocuments(List<int> documentIds, string lastModifiedBy)
        {
            var success = false;
            if (documentIds.Count > 0)
            {
                using (var scope = new TransactionScope())
                { 
                    foreach (var docId in documentIds)
                    {
                        _unitOfWork.DocumentRepository.GetByID(docId);                        
                        _unitOfWork.DocumentsDelete(docId, lastModifiedBy);
                    }
                    scope.Complete();
                    success = true;
                }
            }
            return success;
        }

        /// <summary>
        /// Get all document
        /// </summary>
        /// <returns></returns>
        public IEnumerable<DocumentEntity> GetAllDocuments()
        {
            var documents = _unitOfWork.DocumentRepository.GetAll().ToList();
            if (documents.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Documents, DocumentEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<Documents>, List<DocumentEntity>>(documents);
                return data;
            }
            return null;
        }

        /// <summary>
        /// Get document by document id
        /// </summary>
        /// <param name="keyId"></param>
        /// <returns></returns>
        public DocumentEntity GetDocumentByDocumentId(int keyId)
        {
            var document = _unitOfWork.DocumentRepository.GetByID(keyId);
            if (document != null)
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Documents, DocumentEntity>());
                var mapper = config.CreateMapper();
                DocumentEntity vendorMainModel = mapper.Map<DocumentEntity>(document);
                return vendorMainModel;
            }
            return null;
        }

        /// <summary>
        /// get document by document id
        /// </summary>
        /// <param name="username"></param>
        /// <param name="documentIds"></param>
        /// <returns></returns>
        public bool LockDocuments(List<int> documentIds, bool islock, string username)
        {
            var success = false;
            if (documentIds.Count > 0)
            {
                using (var scope = new TransactionScope())
                {
                    foreach (var docId in documentIds)
                    {
                        _unitOfWork.DocumentsLock(docId, islock, username);
                    }
                    scope.Complete();
                    success = true;
                }
            }
            return success;
        }
        
        /// <summary>
        /// Update document entity
        /// </summary>
        /// <param name="keyId"></param>
        /// <param name="modelEntity"></param>
        /// <returns></returns>
        public bool UpdateDocument(int keyId, DocumentEntity modelEntity)
        {
            var success = false;
            if (modelEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var document = _unitOfWork.DocumentRepository.GetByID(keyId);
                    if (document != null)
                    {
                        
                        document.ID2 = modelEntity.ID2;
                        document.DocTypeID = modelEntity.DocTypeID;
                        document.DocumentFolder = modelEntity.DocumentFolder;
                        document.Description = modelEntity.Description;
                        _unitOfWork.DocumentRepository.Update(document);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }


        public IEnumerable<DocumentsSelectAll_ResultEntity> GetDocumentsById(int keyId)
        {
            List<DocumentsSelectAll_Result> documents = new List<DocumentsSelectAll_Result>(); 
            var dl = _unitOfWork.DocumentsSelectAll(keyId, 0, "O", false, true, false);
            if (dl != null) 
            {
                documents = dl.ToList();
            }
            if (documents.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<DocumentsSelectAll_Result, DocumentsSelectAll_ResultEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<DocumentsSelectAll_Result>, List<DocumentsSelectAll_ResultEntity>>(documents);
                return data;
            }
            return null;
        }

        public string GetImagingSystemSelect() 
        {
            return _unitOfWork.GetImagingSystemSelect();
        }


        public IEnumerable<OrderDetailDTO> GetOrderDetailByOrderNo(int orderNo)
        {
            var orderDetail = _unitOfWork.GetOrderDetailByOrderNo(orderNo).ToList();
            if (orderDetail.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<GetOrderDetailByOrderNo_Result, OrderDetailDTO>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<IList<GetOrderDetailByOrderNo_Result>, IList<OrderDetailDTO>>(orderDetail);
                return data;
            }
            return null;
        }
    }
}
