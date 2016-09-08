using System;

namespace MC.BusinessEntities.Models
{
    public class MenuEntity
    {
        public int MenuId { get; set; }
        public int RefDataId { get; set; }
        public string Caption { get; set; }
        public string RouterLink { get; set; }
        public Nullable<int> MenuRank { get; set; }
        public Nullable<int> ParentMenuId { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string cssClass { get; set; }
    }
}
