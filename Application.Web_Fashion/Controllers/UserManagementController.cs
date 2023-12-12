using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web.App_Code;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace Application.Web.Controllers
{
    [Authorize]
    public class UserManagementController : Controller
    {
        private IUserService userService;
        private IRoleService roleService;
        private IBranchService branchService;
        private ISettingService settingService;
        private IActionLogService actionLogService;

        public UserManagementController(IUserService userService, IRoleService roleService, IBranchService branchService, ISettingService settingService, IActionLogService actionLogService)
        {
            this.userService = userService;
            this.roleService = roleService;
            this.branchService = branchService;
            this.settingService = settingService;
            this.actionLogService = actionLogService;
        }

        public ActionResult CreateUser()
        {            
            return View();
        }

        public ActionResult UserList()
        {
            return View();
        }

        public JsonResult GetUserList()
        {
            var userList = this.userService.GetManagementUsers();

            List<UserViewModel> userViewModelList = new List<UserViewModel>();
            UserViewModel userVM = null;

            foreach (User user in userList)
            {
                if (user.Username.ToLower() != "sadmin")
                {
                    userVM = new UserViewModel();
                    userVM.Id = user.Id;
                    userVM.Name = user.FirstName + " " + user.LastName;
                    userVM.FirstName = user.FirstName;
                    userVM.LastName = user.LastName;
                    userVM.Username = user.Username;
                    userVM.Password = user.Password;
                    userVM.Code = user.Code;
                    userVM.Permissions = user.Permissions;
                    userVM.CreatDate = user.CreateDate;
                    userVM.IsActive = user.IsActive != null ? (bool)user.IsActive : false;
                    userVM.RoleNames = GetUserRoleNames(user.UserRoles);
                    userVM.BranchNames = GetUserBranchNames(user.UserBranches);
                    
                    userViewModelList.Add(userVM);
                }
            }

            return Json(userViewModelList);
        }

        private string GetUserRoleNames(ICollection<UserRole> userRoles)
        {
            string roleNames = String.Empty;

            if (userRoles != null)
            {
                foreach (UserRole userRole in userRoles)
                {
                    roleNames += userRole.Role.Name + ",";
                }

                roleNames = !String.IsNullOrEmpty(roleNames) ? roleNames.TrimEnd(',') : "";
            }

            return roleNames;
        }

        private string GetUserBranchNames(ICollection<UserBranch> userBranches)
        {
            string branchNames = String.Empty;

            if (userBranches != null)
            {
                foreach (UserBranch userBranch in userBranches)
                {
                    branchNames += userBranch.Branch.Name + ",";
                }

                branchNames = !String.IsNullOrEmpty(branchNames) ? branchNames.TrimEnd(',') : "";
            }

            return branchNames;
        }

        public JsonResult GetManagementRoles()
        {
            var roleList = this.roleService.GetManagementRoles();
            List<Role> roles = new List<Role>();

            foreach (var role in roleList)
            {
                roles.Add(new Role { Id = role.Id, Name = role.Name });
            }

            return Json(roles);
        }

        public JsonResult GetUser(string userId)
        {            
            var user = this.userService.GetUserById(userId);
            UserViewModel userVM = new UserViewModel();
            
            if (user != null)
            {
                userVM.Name = user.FirstName;
                userVM.FirstName = user.FirstName;
                userVM.LastName = user.LastName;
                userVM.Username = user.Username;
                userVM.Password = user.Password;
                userVM.Code = user.Code;
                userVM.Permissions = user.Permissions;
                userVM.IsActive = user.IsActive;

                if (user.UserRoles != null)
                {
                    userVM.RoleList = new List<Role>();
                    foreach (UserRole ur in user.UserRoles)
                    {
                        userVM.RoleList.Add(new Role { Id = ur.Role.Id, Name = ur.Role.Name });
                    }
                }
                
                if (user.UserBranches != null)
                {
                    userVM.BranchList = new List<Branch>();
                    foreach (UserBranch ub in user.UserBranches)
                    {
                        userVM.BranchList.Add(new Branch { Id = ub.Branch.Id, Name = ub.Branch.Name });
                    }
                }
            }

            return Json(userVM);
        }

        [HttpPost]
        public ActionResult CreateUser([FromBody] User user)
        {
            bool isSuccess = false;
            string message = String.Empty;

            if (!ModelState.IsValid)
            {
                return View();
            }

            if (String.IsNullOrEmpty(user.Id)) // New User
            {
                using (TransactionScope tran = new TransactionScope())
                {
                    try
                    {
                        string userId = Guid.NewGuid().ToString();

                        // Check user is exists or not
                        var userExists = this.userService.GetUser(user.Username);
                        if (userExists != null)
                        {
                            message = "Username already Exists!";
                            return Json(new
                            {
                                isSuccess = isSuccess,
                                message = message
                            });
                        }

                        // If code provided then check duplicacy
                        if (!String.IsNullOrEmpty(user.Code))
                        {
                            var codeExists = this.userService.GetUserByCode(user.Code);
                            if (codeExists != null)
                            {
                                message = "User code is already Exists!";
                                return Json(new
                                {
                                    isSuccess = isSuccess,
                                    message = message
                                });
                            }
                        }

                        // Get all roles
                        var roleList = this.roleService.GetRoles();
                        List<Role> assignedRoles = new List<Role>();
                        foreach (Role role in roleList)
                        {
                            if (user.UserRoles != null)
                            {
                                foreach (var roleFromUI in user.UserRoles)
                                {
                                    if (role.Id == roleFromUI.RoleId)
                                    {
                                        assignedRoles.Add(role);
                                        break;
                                    }
                                }
                            }
                        }

                        // Get all branches
                        var branchList = this.branchService.GetBranchList();
                        List<Branch> assignedBranches = new List<Branch>();
                        foreach (Branch branch in branchList)
                        {
                            if (user.UserBranches != null)
                            {
                                foreach (var branchFromUI in user.UserBranches)
                                {
                                    if (branch.Id == branchFromUI.BranchId)
                                    {
                                        assignedBranches.Add(branch);
                                        break;
                                    }
                                }
                            }
                        }

                        user.Id = userId;
                        user.IsActive = user.IsActive;
                        user.IsManual = true;
                        user.CreateDate = DateTime.Now;

                        user.UserRoles = new List<UserRole>();
                        foreach (Role role in assignedRoles)
                        {
                            user.UserRoles.Add(new UserRole { Id = Guid.NewGuid().ToString(), RoleId = role.Id, UserId = userId });
                        }

                        user.UserBranches = new List<UserBranch>();
                        foreach (Branch branch in assignedBranches)
                        {
                            user.UserBranches.Add(new UserBranch { Id = Guid.NewGuid().ToString(), BranchId = branch.Id, UserId = userId });
                        }

                        this.userService.CreateUser(user);
                        tran.Complete();
                        isSuccess = true;
                        AppCommon.WriteActionLog(actionLogService, "User Management", "User account created", "Username: " + user.Username, "Create", User.Identity.Name);
                    }
                    catch (Exception exp)
                    {
                        isSuccess = false;
                    }
                }

                return Json(new
                {
                    isSuccess = isSuccess
                });
            }
            else // Update User
            {
                try
                {
                    var userReturn = this.userService.GetUserById(user.Id);
                    if (userReturn != null)
                    {

                        // If code provided then check duplicacy
                        if (!String.IsNullOrEmpty(user.Code))
                        {
                            var codeExists = this.userService.GetUserByCode(user.Code, user.Id);
                            if (codeExists != null)
                            {
                                message = "User code is already Exists!";
                                return Json(new
                                {
                                    isSuccess = isSuccess,
                                    message = message
                                });
                            }
                        }

                        userReturn.FirstName = user.FirstName;
                        userReturn.LastName = user.LastName;
                        userReturn.Username = user.Username;
                        userReturn.Password = user.Password;
                        userReturn.Code = user.Code;
                        userReturn.Permissions = user.Permissions;
                        userReturn.IsActive = user.IsActive;

                        // Update roles
                        List<Role> roleList = new List<Role>();
                        foreach (UserRole ur in user.UserRoles)
                        {
                            roleList.Add(new Role { Id = ur.RoleId });
                        }
                        this.userService.UpdateUserRoles(userReturn.Id, roleList);

                        // Update branches
                        List<Branch> branchList = new List<Branch>();
                        foreach (UserBranch ub in user.UserBranches)
                        {
                            branchList.Add(new Branch { Id = ub.BranchId });
                        }
                        this.userService.UpdateUserBranches(userReturn.Id, branchList);

                        // Update user
                        this.userService.UpdateUser(userReturn);
                        isSuccess = true;
                    }
                    else
                    {
                        isSuccess = false;
                    }                    
                }
                catch (Exception exp)
                {
                    isSuccess = false;
                }

                return Json(new
                {
                    isSuccess = isSuccess,
                });
            }
        }

        public ActionResult DeleteUser(string userId)
        {
            bool isSuccess = false;
            var user = this.userService.GetUserById(userId);
            if (user != null)
            {
                user.IsDelete = true;
                user.Username = user.Username + "_Deleted_" + DateTime.Now.Ticks.ToString();
                userService.UpdateUser(user);
                isSuccess = true;
            }

            return Json(new
            {
                isSuccess,
            });
        }

        public ActionResult UpdateAddress(string userId, string phone, string firstName, string lastName, string city, string prefecture, string postCode, string address)
        {
            bool isSuccess = false;
            var user = this.userService.GetUserById(userId);
            if (user != null)
            {
                user.Username = phone;
                user.FirstName = firstName;
                user.LastName = lastName;
                user.ShipCity = city;
                user.ShipState = prefecture;
                user.ShipZipCode = postCode;
                user.ShipAddress = address;
                userService.UpdateUser(user);
                isSuccess = true;
            }

            return Json(new
            {
                isSuccess,
            });
        }
    }
}