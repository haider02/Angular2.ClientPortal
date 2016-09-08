using System.Collections.Generic;
using MC.BusinessEntities.Models;

namespace MC.BusinessServices
{
    /// <summary>
    /// Address Service Contract
    /// </summary>
    public interface IAddressServices
    {
        AddressEntity GetAddressById(int addressId);
        IEnumerable<AddressEntity> GetAllAddresses();
        int CreateAddress(AddressEntity addressEntity);        
        bool UpdateAddress(int addressId, AddressEntity addressEntity);
        int DeleteAddress(int addressId);
        bool IsDuplicatePhone(AddressEntity contact);
    }
}
