using Application.Common;
using Application.Notification;
using Application.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Application.Controllers
{
    public class StaticController : Controller
    {
        IOptions<AppSettings> settings;

        public StaticController(IOptions<AppSettings> settings)
        {            
            this.settings = settings;
        }

        public ActionResult TermsOfUse()
        {
            return View();
        }

        public ActionResult PrivacyPolicy()
        {
            return View();
        }

        public ActionResult CookiePolicy()
        {
            return View();
        }

        public ActionResult ContactUs()
        {
            return View();
        }

        public ActionResult Help()
        {
            return View();
        }

        public ActionResult Blog()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult PageNotFound()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult ContactUs(string name, string phone, string message)
        {
            string companyEmail = Utils.GetSetting(ESetting.CompanyEmail.ToString());
            string companyPhone = Utils.GetSetting(ESetting.CompanyPhone.ToString());

            EmailNotify emailNotify = new EmailNotify(this.settings);

            string body = "Name: " + name + " Phone: " + phone + " Message: " + message;

            bool isSuccess = emailNotify.SendEmail(companyEmail, "Message from ecommerce website", body);

            return Json(new
            {
                isSuccess = isSuccess,
                hotlineNumber = companyPhone
            });
        }
        
    }
}