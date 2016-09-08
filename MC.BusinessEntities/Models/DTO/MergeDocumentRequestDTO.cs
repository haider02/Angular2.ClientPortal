using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class MergeDocumentRequestDTO
    {
        [Required]
        public List<DocumentEntity> MergeDocuments { get; set; }
        public List<int> DocIDs { get; set; }
        public DocumentEntity DocumentDetails { get; set; }

    }
}
