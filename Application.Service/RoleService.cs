using System.Collections.Generic;
using System.Linq;
using Application.Data.Repository;
using Application.Data.Infrastructure;
using Application.Model.Models;
using Application.Service.Properties;
using System;
using Application.Common;
using Application.ViewModel;

namespace Application.Service
{

    public interface IRoleService
    {
        void CreateRole(Role role);
        IEnumerable<Role> GetRoles();
        IEnumerable<Role> GetUserRoles(string userId);
        IEnumerable<Role> GetManagementRoles();
        Role GetRole(string name);
        void Commit();
    }

    public class RoleService : IRoleService
    {
        private readonly IRoleRepository roleRepository;
        private readonly IUnitOfWork unitOfWork;

        public RoleService(IRoleRepository roleRepository, IUnitOfWork unitOfWork)
        {
            this.roleRepository = roleRepository;
            this.unitOfWork = unitOfWork;           
        }
        
        #region IRoleService Members

        public void CreateRole(Role role)
        {
            roleRepository.Add(role);
            Commit();
        }

        public IEnumerable<Role> GetRoles()
        {
            var roles = roleRepository.GetAll().OrderBy(r => r.Name).ToList();
            return roles;
        }

        public IEnumerable<Role> GetUserRoles(string userId)
        {
            List<Role> roles = new List<Role>();

            string sql = String.Format("Select r.Id, r.Name, ur.UserId, ur.RoleId from Roles r, UserRoles ur Where r.Id = ur.RoleId And UserId = '{0}'", userId);
            roles = Utils.ExecuteQuery<Role>(sql).ToList();

            return roles;
        }

        public IEnumerable<Role> GetManagementRoles()
        {
            var roles = roleRepository.GetMany(r=> r.Name.ToLower() != "customer").OrderBy(r => r.Name).ToList();
            return roles;
        }

        public Role GetRole(string name)
        {
            try
            {
                var role = roleRepository.Get(r => r.Name == name);

                return role;
            }
            catch(Exception exp)
            {

            }

            return null;
        }
                
        public void Commit()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
