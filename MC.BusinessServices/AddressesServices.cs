using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;

namespace MC.BusinessServices
{
    class AddressesServices : IAddressServices
    {
        private readonly UnitOfWork _unitOfWork;
        /// <summary>
        /// Public constructor.
        /// </summary>
        public AddressesServices(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Fetches Addresses details by id
        /// </summary>
        /// <param name="addressId"></param>
        /// <returns></returns>
        public AddressEntity GetAddressById(int addressId)
        {
            var address = _unitOfWork.AddressRepository.GetByID(addressId);
            if (address != null)
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Addresses, AddressEntity>());
                var mapper = config.CreateMapper();
                AddressEntity addressModel = mapper.Map<AddressEntity>(address);
                return addressModel;
            }
            return null;
        }
        
        /// <summary>
        /// Fetches all the Addresses.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<AddressEntity> GetAllAddresses()
        {
            var addresses = _unitOfWork.AddressRepository.GetAll().ToList();
            if (addresses.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<Addresses, AddressEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<Addresses>, List<AddressEntity>>(addresses);
                return data;
            }
            return null;
        }

        /// <summary>
        /// Creates a Addresses
        /// </summary>
        /// <returns></returns>
        public int CreateAddress(AddressEntity addressEntity)
        {
            using (var scope = new TransactionScope())
            {
                var address = new Addresses
                {
                    AddressType = addressEntity.AddressType,
                    Suffix = addressEntity.Suffix,
                    XRefId = addressEntity.XRefId,
                    Line1 = addressEntity.Line1,
                    city = addressEntity.city,
                    State = addressEntity.State,
                    Zip = addressEntity.Zip,
                    County = addressEntity.County,
                    Phone = addressEntity.Phone,
                    Fax = addressEntity.Fax,
                    Email = addressEntity.Email,
                    LastModBy = addressEntity.LastModBy,
                    LastModDate = addressEntity.LastModDate,
                    Description = addressEntity.Description,
                    Cell=addressEntity.Cell
                };
                _unitOfWork.AddressRepository.Insert(address);
                _unitOfWork.Save();
                scope.Complete();                
                return 1;
            }
        }

        /// <summary>
        /// Updates a address
        /// </summary>
        /// <returns></returns>
        public bool UpdateAddress(int addressId, AddressEntity addressEntity)
        {
            var success = false;
            if (addressEntity != null)
            {
                using (var scope = new TransactionScope())
                {
                    var address = _unitOfWork.AddressRepository.GetByID(addressId);
                    if (address != null)
                    {
                        address.AddressType = addressEntity.AddressType;
                        address.city = addressEntity.city;
                        address.Zip = addressEntity.Zip;
                        address.Line1 = addressEntity.Line1;
                        address.County = addressEntity.County;
                        address.Fax = addressEntity.Fax;
                        address.Phone = addressEntity.Phone;
                        address.Email = addressEntity.Email;
                        address.Description = addressEntity.Description;
                        address.Cell = addressEntity.Cell;
                        _unitOfWork.AddressRepository.Update(address);
                        _unitOfWork.Save();
                        scope.Complete();
                        success = true;
                    }
                }
            }
            return success;
        }

        /// <summary>
        /// Deletes a particular Addresses
        /// </summary>
        /// <param name="addressId"></param>
        /// <returns></returns>
        public int DeleteAddress(int addressId)
        {
            int success = 0;
            if (addressId > 0)
            {
                using (var scope = new TransactionScope())
                {
                    var address = _unitOfWork.AddressRepository.GetByID(addressId);
                    if (address != null)
                    {
                        _unitOfWork.AddressesDelete(addressId);
                        scope.Complete();
                        success = 1;
                    }
                }
            }
            return success;
        }

        public bool IsDuplicatePhone(AddressEntity address)
        {
            var addressExist = _unitOfWork.AddressRepository.GetMany(x => x.Phone == address.Phone && x.AddressId != address.AddressId).FirstOrDefault();
            if (addressExist != null)
                return true;
            else
                return false;
        }
    }
}
