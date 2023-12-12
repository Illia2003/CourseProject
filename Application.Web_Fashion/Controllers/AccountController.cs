using Application.Common;
using Application.Logging;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace Application.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private IRoleService roleService;
        private IUserService userService;                

        public AccountController(IUserService userService, IRoleService roleService)
        {
            this.roleService = roleService;
            this.userService = userService;
        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Register1()
        {
            return View("Register");
        }
                
        public ActionResult ChangePassword()
        {
            return View();
        }

        public ActionResult AccountInfo()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult RegisterAccount([FromBody] User user, bool byAdmin = false)
        {
            if (ModelState.IsValid)
            {
                bool isSuccess = true;
                string userId = Guid.NewGuid().ToString();

                using (TransactionScope tran = new TransactionScope())
                {
                    try
                    {
                        if (String.IsNullOrEmpty(user.Id)) // Create
                        {
                            // Check username is already taken or not
                            User userExist = this.userService.GetUser(user.Username);
                            if (userExist != null)
                            {
                                return Json(new
                                {
                                    isSuccess = false,
                                    message = "This username is already exists! Please try with another one.",
                                });
                            }

                            // Get member role
                            Role memberRole = this.roleService.GetRole(ERoleName.customer.ToString());
                            if (memberRole == null)
                            {
                                isSuccess = false;
                                ErrorLog.LogError("Member Role is null");
                            }

                            if (isSuccess)
                            {
                                user.Id = userId;
                                user.IsActive = true;
                                user.IsVerified = true;
                                user.IsDelete = false;
                                user.CreateDate = DateTime.Now;
                                
                                user.UserRoles.Add(new UserRole { UserId = userId, RoleId = memberRole.Id });
                                
                                this.userService.CreateUser(user);

                                if (!byAdmin)
                                {
                                    // Silent login
                                    AppUtils.SilentLogin(userService, roleService, userId);

                                    // Store the userid in cookie
                                    AppHttpContext.Current.Response.Cookies.Append("userid", userId);
                                }

                                // Now complete the transaction
                                tran.Complete();
                            }
                        }
                        else // Update
                        {
                            // Check username is already taken or not
                            User userExist = this.userService.GetUserExcludeMe(user.Id, user.Username);
                            if (userExist != null)
                            {
                                return Json(new
                                {
                                    isSuccess = false,
                                    message = "This mobile is already used as username. Please try with another mobile! ",
                                });
                            }

                            User userToUpdate = this.userService.GetUserById(user.Id);
                            if (userToUpdate != null)
                            {
                                userToUpdate.Username = user.Username;
                                userToUpdate.Password = user.Password;
                                userToUpdate.FirstName = user.FirstName;
                                userToUpdate.FirstName = user.FirstName;
                                userToUpdate.LastName = user.LastName;                                
                                userToUpdate.ShipAddress = user.ShipAddress;
                                userToUpdate.ShipZipCode = user.ShipZipCode;
                                userToUpdate.ShipCity = user.ShipCity;
                                userToUpdate.ShipState = user.ShipState;
                                userToUpdate.ShipCountry = user.ShipCountry;

                                this.userService.UpdateUser(userToUpdate);
                                tran.Complete();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        isSuccess = false;
                        ErrorLog.LogError(ex);
                    }
                }

                return Json(new
                {
                    isSuccess = isSuccess,
                    userId = userId,                    
                });
            }

            return View();
        }

        [HttpPost]
        public ActionResult UpdateUserAddress(string mobile, string firstName, string lastName, string address, string zipCode, string city, string state, string country)
        {
            bool isSuccess = false;
            var user = this.userService.GetUserById(AppUtils.GetLoggedInUserId());
            if (user != null)
            {
                // Check username is already taken or not
                User userExist = this.userService.GetUserExcludeMe(user.Id, mobile );
                if (userExist != null)
                {
                    return Json(new
                    {
                        isSuccess = false,
                        message = "This username is already used. Please try with another one! ",
                    });
                }

                user.Username = mobile;
                user.FirstName = firstName;
                user.LastName = lastName;                
                user.ShipAddress = address;
                user.ShipZipCode = zipCode;
                user.ShipCity = city;
                user.ShipState = state;
                user.ShipCountry = country;

                this.userService.UpdateUserInfo(user);
                isSuccess = true;
            }

            if (!isSuccess)
            {
                ErrorLog.LogError("User Info Update Failed!");
            }

            return Json(new
            {
                isSuccess = isSuccess
            });
        }
        
        [HttpPost]
        public ActionResult UpdateUserInfo(string email)
        {
            bool isSuccess = false;
            var user = this.userService.GetUserById(AppUtils.GetLoggedInUserId());
            if (user != null)
            {
                user.Username = email;

                this.userService.UpdateUserInfo(user);
                isSuccess = true;
            }

            if (!isSuccess)
            {
                ErrorLog.LogError("User Info Update Failed!");
            }

            return Json(new
            {
                isSuccess = isSuccess
            });
        }        
        
        [HttpGet]
        [AllowAnonymous]
        public ActionResult GetUserStatus()
        {
            bool isUserLoggedIn = false;
            bool isUserVerified = false;
            bool isAdmin = User.IsInRole(ERoleName.admin.ToString());

            isUserLoggedIn = (AppUtils.GetLoggedInUser() == null) ? false : true;

            if (isUserLoggedIn)
            {
                isUserVerified = AppUtils.GetLoggedInUser().IsVerified;
            }

            return Json(new
            {
                isLoggedIn = isUserLoggedIn,
                isVerified = isUserVerified,
                isAdmin = isAdmin
            });

        }

        public JsonResult GetUser(string username)
        {
            User user = this.userService.GetUser(username);
            return Json(username);
        }

        public JsonResult GetUserByPhone(string phoneNo)
        {
            UserViewModel uvm = new UserViewModel();

            var user = this.userService.GetUserByPhone(phoneNo);

            if (user != null)
            {
                uvm.Id = user.Id;
                uvm.Name = user.FirstName + " " + user.LastName;
                uvm.Username = user.Username;                
                uvm.FirstName = user.FirstName;
                uvm.LastName = user.LastName;
                uvm.ShipAddress = user.ShipAddress;
                uvm.ShipCity = user.ShipCity;
                uvm.ShipCountry = user.ShipCountry;
                uvm.ShipState = user.ShipState;
                uvm.ShipZipCode = user.ShipZipCode;
            }

            return Json(uvm);
        }

        public JsonResult GetLoggedInUserInformation()
        {
            UserViewModel uvm = new UserViewModel();

            User user = AppUtils.GetLoggedInUser();
            if (user != null)
            {
                uvm.Name = user.FirstName + " " + user.LastName;
                uvm.Username = user.Username;                
                uvm.FirstName = user.FirstName;
                uvm.LastName = user.LastName;
                uvm.ShipAddress = user.ShipAddress;
                uvm.ShipCity = user.ShipCity;
                uvm.ShipCountry = user.ShipCountry;
                uvm.ShipState = user.ShipState;
                uvm.ShipZipCode = user.ShipZipCode;
            }

            return Json(uvm);
        }

        public JsonResult GetLoggedInUserAddress()
        {
            UserViewModel uvm = new UserViewModel();

            User user = AppUtils.GetLoggedInUser();
            if (user != null)
            {
                user = this.userService.GetUser(user.Username);

                uvm.Name = user.FirstName + " " + user.LastName;
                uvm.Username = user.Username;                
                uvm.FirstName = user.FirstName;
                uvm.LastName = user.LastName;
                uvm.ShipAddress = user.ShipAddress;
                uvm.ShipCity = user.ShipCity;
                uvm.ShipCountry = user.ShipCountry;
                uvm.ShipState = user.ShipState;
                uvm.ShipZipCode = user.ShipZipCode;
            }

            return Json(uvm);
        }

    }
}