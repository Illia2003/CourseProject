using Application.Common;
using Application.Logging;
using Application.Notification;
using Application.Service;
using Application.ViewModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Application.Web.Controllers
{
    [Authorize]
    public class SecurityController : Controller
    {
        private IUserService userService;
        private IRoleService roleService;
        private ISettingService settingService;
        private IOptions<AppSettings> settings;
        private IWebHostEnvironment hostEnvironment;

        public SecurityController(IUserService userService, IRoleService roleService, ISettingService settingService, IOptions<AppSettings> settings, IWebHostEnvironment hostEnvironment)
        {
            this.userService = userService;
            this.roleService = roleService;
            this.settingService = settingService;
            this.settings = settings;
            this.hostEnvironment = hostEnvironment;
        }

        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {            
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult ForgotPassword(LoginViewModel model)
        {
            bool isSuccess = false;
            string message = String.Empty;

            var user = userService.GetUser(model.Username);

            if (user != null && !String.IsNullOrEmpty(user.Username))
            {
                isSuccess = SendPasswordToEmail(user.Username, user.Password);
            }
            else
            {
                message = "Your email not found!";
            }

            return Json(new
            {
                isSuccess = isSuccess,
                message = message
            });           
        }        
        
        private bool SendPasswordToEmail(string userName, string password)
        {
            EmailNotify emailNotify = new EmailNotify(this.settings);

            string emailTemplate = Utils.GetFileText("~/Static/EmailTemplates/ForgotPassword.htm");

            string message = String.Empty;
            if (emailTemplate.Length > 0)
            {
                message = emailTemplate;
                message = message.Replace("#USERNAME#", userName);
                message = message.Replace("#PASSWORD#", password);
            }

            bool isSuccess = emailNotify.SendEmail(userName, "Your password", message);
            return isSuccess;
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(LoginViewModel model)
        {
            string redirectUrl = string.Empty;
            string message = string.Empty;
            bool isSuccess = false;

            var user = this.userService.GetUser(model.Username, model.Password);
            if (user != null)
            {
                isSuccess = true;

                // Set loing cookies
                AppUtils.SetAuthenticationCookie(roleService, user, model.RememberMe);

                // Update last login time
                this.userService.UpdateLastLoginTime(user.Id);

                if (String.IsNullOrEmpty(redirectUrl))
                {
                    if (this.userService.IsInRole(model.Username, ERoleName.customer.ToString()))
                    {
                        redirectUrl = String.IsNullOrEmpty(model.ReturnUrl) ? Url.Action("Index", "Customer") : model.ReturnUrl;
                    }
                    else
                    {
                        redirectUrl = Url.Action("Index", "Admin");
                    }
                }
            }
            else
            {
                message = "Invalid username or password!";
            }

            return Json(new
            {
                isSuccess = isSuccess,
                redirectUrl = redirectUrl,
                message = message
            });
        }
        
        public void SignOut()
        {
            AppHttpContext.Current.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            // Clear user session
            AppHttpContext.Current.Session.SetObject("User", null);

            Response.Redirect("/Home/Index");
        }

        [HttpPost]        
        public ActionResult ChangePassword(string newPassword)
        {
            bool isSuccess = false;
            string message = string.Empty;

            string userName = User.Identity.Name;

            isSuccess = this.userService.ChangePassword(userName, newPassword);

            if (!isSuccess)
            {
                ErrorLog.LogError("Change Password Failed");
            }

            return Json(new
            {
                isSuccess = isSuccess,
                message = message
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult IsValidUser(string password)
        {
            bool isSuccess = false;
            string userName = User.Identity.Name;

            var user = this.userService.GetUser(userName, password);
            if (user != null)
            {
                isSuccess = true;
            }
            
            return Json(new
            {
                isSuccess = isSuccess                
            });
        }      
    }
}