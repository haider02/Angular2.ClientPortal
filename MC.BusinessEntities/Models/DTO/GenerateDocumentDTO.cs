using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MC.BusinessEntities.Models.DTO
{
    public class GenerateDocumentDTO
    {
        [Required]
        public int ID { get; set; }
        [Required]
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string ImagingPath { get; set; }
        public string ImagingURL { get; set; }
    }
}
