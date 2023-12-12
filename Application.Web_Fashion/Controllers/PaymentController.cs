using Application.Common;
using Application.Logging;
using Application.Model.Models;
using Application.Service;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace Application.Web.Controllers
{
    public class PaymentController : Controller
    {
        private IMembershipPlanService membershipPlanService;
        private ISubscriptionService subscriptionService;
        private IPaymentTransactionService paymentTransactionService;

        public PaymentController(IMembershipPlanService membershipPlanService, ISubscriptionService subscriptionService, IPaymentTransactionService paymentTransactionService)
        {
            this.membershipPlanService = membershipPlanService;
            this.subscriptionService = subscriptionService;
            this.paymentTransactionService = paymentTransactionService;
        }

        public ActionResult MembershipPlan()
        {
            return View();
        }

        public void PayAmount(int planId)
        {
            if (Utils.GetLoggedInUser() == null)
            {
                Response.Redirect("/Security/Login?returnUrl=Payment/MembershipPlan");                
            }

            MembershipPlan plan = this.membershipPlanService.GetMembershipPlan(planId);
            if (plan != null)
            {
                string userId = Utils.GetLoggedInUser().Id;            
                int amount = decimal.ToInt32(plan.Amount - plan.Discount);

                string domainName = HttpContext.Request.Url.Host + (HttpContext.Request.Url.IsDefaultPort ? "" : ":" + HttpContext.Request.Url.Port);
                string trandId = DateTime.Now.Ticks.ToString();
                string storeId = Utils.GetConfigValue("PG_StoreId");
                string totalAmount = plan.Amount.ToString();
                string successUrl = "http://" + domainName + "/Payment/PaymentSuccess?userId=" + userId +"&tranId=" + trandId + "&planId=" + planId;
                string failureUrl = "http://" + domainName + "/Payment/PaymentFailure?UserId=" + userId + "&tranId=" + trandId + "&planId=" + planId;
                string cancelUrl = "http://" + domainName + "/Payment/PaymentCancel?UserId=" + userId + "&tranId=" + trandId + "&planId=" + planId;

                NameValueCollection param = new NameValueCollection() {
                                    { "store_id", storeId },
                                    { "tran_id", trandId },
                                    { "total_amount", totalAmount },
                                    { "success_url", successUrl },
                                    { "fail_url", failureUrl },
                                    { "cancel_url", cancelUrl },
                                    { "currency", "BDT" }
                                };

                string gatewayUrl = Utils.GetConfigValue("PG_Url"); ;

                RedirectWithData(param, gatewayUrl);
            }
        }

        public ActionResult PaymentSuccess(string userId, string tranId, int planId)
        {
            string status = Request.Form["status"];
            string tran_id = Request.Form["tran_id"];
            string val_id = Request.Form["val_id"];
            string tran_date = Request.Form["tran_date"];
            string amount = Request.Form["amount"];
            string store_amount = Request.Form["store_amount"];

            bool isSuccess = false;
            string membershipStatus = String.Empty;

            if (status == "VALID" && tranId == tran_id)
            {
                // Subscribe user
                MembershipPlan plan = this.membershipPlanService.GetMembershipPlan(planId);
                if (plan != null && !String.IsNullOrEmpty(amount))
                {
                    isSuccess = SubscribeUser(userId, plan);
                    membershipStatus = isSuccess ? "SUCCESS" : "FAILED";
                }

                // Validation from ssl commerz
                PaymentTransaction paymentTran = GetResponseData(val_id);

                if (paymentTran != null)
                {
                    // Log payment transaction
                    paymentTran.MemberId = userId;
                    paymentTran.MembershipStatus = membershipStatus;
                    this.paymentTransactionService.CreatePaymentTransaction(paymentTran);
                }
                else
                {
                    LogInvalidTransaction(userId, membershipStatus, "Success But Validation Failed", tran_id, amount, store_amount);
                }
            }
            else
            {
                LogInvalidTransaction(userId, membershipStatus, "InValid", tran_id, amount, store_amount);
            }

            // Redirect to confirmation page
            return RedirectToAction("MembershipSuccess", "Info");
        }

        private void LogInvalidTransaction(string userId, string membershipStatus, string status, string tran_id, string amount, string store_amount)
        {
            PaymentTransaction paymentTran = new PaymentTransaction();
            paymentTran.MemberId = userId;
            paymentTran.MembershipStatus = membershipStatus;
            paymentTran.Status = status;
            paymentTran.Tran_Id = tran_id;
            paymentTran.Tran_Date = DateTime.Now;
            paymentTran.Amount = (!String.IsNullOrEmpty(amount)) ? Decimal.Parse(amount) : 0;
            paymentTran.Store_Amount = (!String.IsNullOrEmpty(store_amount)) ? Decimal.Parse(store_amount) : 0;
            this.paymentTransactionService.CreatePaymentTransaction(paymentTran);
        }

        public PaymentTransaction GetResponseData(string val_id)
        {
            PaymentTransaction paymentTran = null;
            var valId = val_id;
            var storeID = Utils.GetConfigValue("PG_StoreId");
            var storePass = Utils.GetConfigValue("PG_StorePassword");
            var validateurl = Utils.GetConfigValue("PG_ValidationUrl") + "?val_id=" + valId + "&Store_Id=" + storeID + "&Store_Passwd=" + storePass + "&v=1&format=json";
            try
            {
                //request
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(validateurl);
                request.Method = "GET";

                //response
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                paymentTran = JsonConvert.DeserializeObject<PaymentTransaction>(reader.ReadToEnd().ToString());
            }
            catch (Exception)
            {
            }
            return paymentTran;
        }

        public bool SubscribeUser(string userId, MembershipPlan plan)
        {
            bool isSuccess = AppUtils.SubscribeUser(this.subscriptionService, userId, plan);
            
            /*
            try
            {
                Subscription subs = this.subscriptionService.GetSubscription(userId);
                if (subs != null)
                {
                    if (subs.ExpireDate > DateTime.Now)
                    {
                        subs.MembershipPlanId = plan.Id;
                        subs.ExpireDate = subs.ExpireDate.AddDays(plan.NumberOfDays);
                        subs.MessageLimit = subs.MessageLimit + plan.MessageLimit;
                        subs.ReplyMessageLimit = subs.ReplyMessageLimit + plan.ReplyMessageLimit;
                        subs.SmsLimit = subs.SmsLimit + plan.SmsLimit;
                        subs.ExpressInterestLimit = subs.ExpressInterestLimit + plan.ExpressInterestLimit;
                        subs.PhotoLimit = subs.PhotoLimit + plan.PhotoLimit;
                        subs.IsAllowChat = plan.IsAllowChat;
                    }
                    else
                    {
                        subs.MembershipPlanId = plan.Id;
                        subs.ExpireDate = DateTime.Now.AddDays(plan.NumberOfDays);
                        subs.MessageLimit = plan.MessageLimit;
                        subs.ReplyMessageLimit = plan.ReplyMessageLimit;
                        subs.SmsLimit = plan.SmsLimit;
                        subs.ExpressInterestLimit = plan.ExpressInterestLimit;
                        subs.PhotoLimit = plan.PhotoLimit;
                        subs.IsAllowChat = plan.IsAllowChat;
                    }

                    this.subscriptionService.UpdateSubscription(subs);
                }
                else
                {
                    subs = new Subscription();
                    subs.MembershipPlanId = plan.Id;
                    subs.UserId = userId;
                    subs.StartDate = DateTime.Now;
                    subs.ExpireDate = DateTime.Now.AddDays(plan.NumberOfDays);
                    subs.MessageLimit = plan.MessageLimit;
                    subs.ReplyMessageLimit = plan.ReplyMessageLimit;
                    subs.SmsLimit = plan.SmsLimit;
                    subs.ExpressInterestLimit = plan.ExpressInterestLimit;
                    subs.PhotoLimit = plan.PhotoLimit;
                    subs.IsAllowChat = plan.IsAllowChat;
                    subs.ActionDate = DateTime.Now;

                    this.subscriptionService.CreateSubscription(subs);
                }
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex, "User Subscription Failed");
            }*/

            return isSuccess;
        }

        public ActionResult PaymentFailure(string userId, string tranId, int planId)
        {
            LogInvalidTransaction(userId, "", "Payment Failed", tranId, "", "");
            return View();
        }

        public ActionResult PaymentCancel(string userId, string tranId, int planId)
        {
            return View();
        }

        public void RedirectWithData(NameValueCollection data, string url)
        {
            HttpResponse response = System.Web.HttpContext.Current.Response;
            response.Clear();

            StringBuilder s = new StringBuilder();
            s.Append("<html>");
            s.AppendFormat("<body onload='document.forms[\"form\"].submit()'>");
            s.AppendFormat("<form name='form' action='{0}' method='post'>", url);
            foreach (string key in data)
            {
                s.AppendFormat("<input type='hidden' name='{0}' value='{1}' />", key, data[key]);
            }
            s.Append("</form></body></html>");
            response.Write(s.ToString());
            response.End();
        }
	}
}