using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using AutoMapper;
using MC.BusinessEntities.Models;
using MC.DataModel;
using MC.DataModel.UnitOfWork;
using System;

namespace MC.BusinessServices.ClientPortal
{
    public class SecurityFormService : ISecurityFormService
    {
        private readonly UnitOfWork _unitOfWork;

        public SecurityFormService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<SecurityFormEntity> GetAllSecurityForms()
        {
            var securityForm = _unitOfWork.SecurityFormRepository.GetMany(x => x.Inactive == false).ToList();
            if (securityForm.Any())
            {
                var config = new MapperConfiguration(cfg => cfg.CreateMap<SecurityForm, SecurityFormEntity>());
                var mapper = config.CreateMapper();
                var data = mapper.Map<List<SecurityForm>, List<SecurityFormEntity>>(securityForm);
                return data;
            }
            return null;
        }

        public bool CreateUpdateSecurityForm(SecurityFormEntity securityForm)
        {
            using (var scope = new TransactionScope())
            {               
                SecurityForm sc = new SecurityForm()
                {
                    Name = securityForm.Name,
                    CreatedBy = securityForm.CreatedBy,
                    CreatedDate = securityForm.CreatedDate,
                    Description = securityForm.Description,
                    Inactive = securityForm.Inactive,
                    LastModBy = securityForm.LastModBy,
                    LastModDate = securityForm.LastModDate,
                    SecurityFormId = securityForm.SecurityFormId,
                    ApplicationId = securityForm.ApplicationId
                };

                if (securityForm.SecurityFormId > 0)
                {
                    sc.LastModDate = DateTime.Now;
                    _unitOfWork.SecurityFormRepository.Update(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                else
                {
                    sc.LastModDate = DateTime.Now;
                    sc.CreatedDate = DateTime.Now;
                    _unitOfWork.SecurityFormRepository.Insert(sc);
                    _unitOfWork.Save();
                    scope.Complete();
                }
                return true;
            }
        }

        public int DeleteSecurityControl(int securityControlId)
        {
            int success = 0;
            if (securityControlId > 0)
            {                
                success = _unitOfWork.CPDeleteSecurityForm(securityControlId);                
            }
            return success;
        }
    }
}
