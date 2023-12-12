using System.Collections.Generic;
using System.Linq;
using Application.Data.Repository;
using Application.Data.Infrastructure;
using Application.Model.Models;
using Application.Common;
using Application.Service.Properties;
using System;
using Application.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Service
{
    public interface IUserService
    {
        void CreateUser(User user);
        void UpdateUser(User user);        
        IEnumerable<User> GetManagementUsers();
        IEnumerable<User> GetUserList(string type);
        User GetUserById(string id);
        User GetUser(string username);
        User GetUserExcludeMe(string id, string username);
        User GetUserByCode(string code, string excludeUserId = "");
        User GetUserByPhone(string phoneNo);
        User GetUser(string username, string password);
        IEnumerable<User> GetUnSyncUsers();
        IEnumerable<User> GetAllUsers();
        IEnumerable<User> GetAllCustomers();
        void MarkIsSync(string userIds);
        bool IsInRole(string username, string roleName);
        bool IsVerifiedUser(string userId);
        bool VerifiedUser(string userId);
        bool ActivateUser(string userId);
        bool DeleteUser(string userId);
        bool ChangePassword(string userName, string newPassword);
        void UpdateLastLoginTime(string userId);
        void UpdateUserInfo(User user);
        void UpdateUserRoles(string userId, List<Role> roleList);
        void UpdateUserBranches(string userId, List<Branch> branchList);
        void Commit();
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly IRoleRepository roleRepository;
        private readonly IUnitOfWork unitOfWork;

        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork, IRoleRepository roleRepository)
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;
            this.roleRepository = roleRepository;
        }

        #region IUserService Members

        public void CreateUser(User user)
        {
            userRepository.Add(user);
            Commit();
        }

        public void UpdateUser(User user)
        {
            userRepository.Update(user);
            Commit();
        }

        //public IEnumerable<User> GetUsers()
        //{
        //    var users = userRepository.GetMany(r => r.IsActive == true && r.IsVerified == true && r.IsDelete == false).OrderByDescending(u => u.CreateDate).ToList();
        //    return users;
        //}

        public IEnumerable<User> GetManagementUsers()
        {
            var users = userRepository.GetMany(r => r.IsManual == true && r.IsDelete != true).OrderBy(u => u.FirstName).ToList();
            return users;
        }

        public IEnumerable<User> GetUnSyncUsers()
        {
            var users = userRepository.GetMany(r => r.IsDelete != true && r.IsSync != true).ToList();
            return users;
        }

        public IEnumerable<User> GetAllUsers()
        {
            var users = userRepository.GetMany(r => r.IsDelete != true).ToList();
            return users;
        }

        public IEnumerable<User> GetAllCustomers()
        {
            var users = userRepository.GetMany(r => r.IsManual != true && r.IsDelete != true && r.Username != "Guest").OrderBy(u => u.FirstName).ToList();
            return users;
        }

        public void MarkIsSync(string userIds)
        {
            string sql = String.Format("Update Users Set IsSync = 1 where Id IN ({0})", userIds);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);                ;
            }
        }

        public IEnumerable<User> GetUserList(string type)
        {
            var users = new List<User>();

            if (type.ToLower() == "unverified")
            {
                users = userRepository.GetMany(r => r.IsVerified == false && r.IsDelete == false).OrderByDescending(u => u.CreateDate).ToList();
            }
            else if (type.ToLower() == "deleted")
            {
                users = userRepository.GetMany(r => r.IsDelete == true).OrderByDescending(u => u.CreateDate).ToList();
            }
            else if (type.ToLower() == "inactive")
            {
                users = userRepository.GetMany(r => r.IsActive == true).OrderByDescending(u => u.CreateDate).ToList();
            }

            return users;
        }

        public User GetUserById(string id)
        {
            var users = userRepository.Get(u => u.Id == id);
            return users;
        }

        public User GetUser(string username)
        {
            var users = userRepository.Get(u => u.Username == username);
            return users;
        }

        public User GetUserExcludeMe(string id, string username)
        {
            var users = userRepository.Get(u => u.Id != id && u.Username == username);
            return users;
        }

        public User GetUserByCode(string code, string excludeUserId = "")
        {
            User user = null;
            if (String.IsNullOrEmpty(excludeUserId))
            {
                user = userRepository.Get(u => u.Code == code);
            }
            else
            {
                user = userRepository.Get(u => u.Id != excludeUserId && u.Code == code);
            }

            return user;
        }

        public User GetUserByPhone(string phoneNo)
        {
            var users = userRepository.Get(u => u.Username == phoneNo);
            return users;
        }

        public User GetUser(string username, string password)
        {
            var users = userRepository.Get(u => u.Username == username && u.Password == password && u.IsActive == true && u.IsDelete == false);
            return users;
        }

        public bool IsInRole(string username, string roleName)
        {
            bool isInRole = false;
            var user = userRepository.Get(u => u.Username == username);
            if (user != null)
            {
                if (user.UserRoles != null)
                {
                    foreach (UserRole userRole in user.UserRoles)
                    {
                        if (userRole.Role.Name == roleName)
                        {
                            isInRole = true;
                            break;
                        }
                    }
                }
            }


            return isInRole;


        }

        public bool IsVerifiedUser(string userId)
        {
            var user = userRepository.Get(u => u.Id == userId && u.IsActive == true && u.IsVerified == true);
            if (user != null)
            {               
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool VerifiedUser(string userId)
        {
            var user = userRepository.Get(u => u.Id == userId);
            if (user != null)
            {
                user.IsVerified = true;
                userRepository.Update(user);
                Commit();
                return true;
            }
            else
            {
                return false;
            }            
        }

        public bool DeleteUser(string userId)
        {
            var user = userRepository.Get(u => u.Id == userId);
            if (user != null)
            {
                user.IsDelete = true;
                userRepository.Update(user);
                Commit();
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool ActivateUser(string userId)
        {
            var user = userRepository.Get(u => u.Id == userId);
            if (user != null)
            {
                user.IsActive = true;
                userRepository.Update(user);
                Commit();
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool ChangePassword(string userName, string newPassword)
        {
            User user = this.GetUser(userName);
            if (user != null)
            {
                user.Password = newPassword;
            }
            else
            {
                return false;
            }
            
            userRepository.Update(user);
            Commit();

            return true;
        }

        public void UpdateLastLoginTime(string userId)
        {
            User user = this.GetUserById(userId);
            if (user != null)
            {
                user.LastLoginTime = DateTime.Now;

                userRepository.Update(user);
                Commit();
            }            
        }
        
        public void UpdateUserBranches(string userId, List<Branch> branchList)
        {
            // Delete existing branch
            string sql = String.Format("Delete From UserBranches Where UserId = '{0}'", userId);            
            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }

            // Add new branch
            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                foreach (var branch in branchList)
                {
                    sql = String.Format("Insert Into UserBranches (Id, BranchId, UserId) Values( '{0}', '{1}', '{2}' )", Guid.NewGuid().ToString(), branch.Id, userId);
                    context.Database.ExecuteSqlRaw(sql);
                }
            }
        }

        public void UpdateUserRoles(string userId, List<Role> roleList)
        {
            // Delete existing roles
            string sql = String.Format("Delete From UserRoles Where UserId = '{0}'", userId);
            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }

            // Add new role
            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                foreach (var role in roleList)
                {
                    sql = String.Format("Insert Into UserRoles (Id, RoleId, UserId) Values( '{0}', '{1}', '{2}' )", Guid.NewGuid().ToString(), role.Id, userId);
                    context.Database.ExecuteSqlRaw(sql);
                }
            }
        }

        public void UpdateUserInfo(User user)
        {
            userRepository.Update(user);
            Commit();
        }

        public void Commit()
        {
            unitOfWork.Commit();
        }
              
        #endregion
    }
}
