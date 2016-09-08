using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices
{
    /// <summary>
    /// Offers services for Menu specific CRUD operations
    /// </summary>
    public class MenuServices : IMenuServices
    {
        private readonly UnitOfWork _unitOfWork;

        /// <summary>
        /// Public constructor.
        /// </summary>
        public MenuServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Fetches all the Menu records.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<MenuEntity> GetAllMenu()
        {
            var entityList = _unitOfWork.MenuRepository.Get().ToList();
            if (entityList.Any())
            {   
                var config = new MapperConfiguration(cfg => cfg.CreateMap<sysMenu, MenuEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<sysMenu>, List<MenuEntity>>(entityList);
                return data;
            }
            return null;
        }
        
    }
}
