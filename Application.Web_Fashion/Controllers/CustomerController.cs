using Application.Common;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web;
using Application.Web.App_Code;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Application.Controllers
{
    [Authorize]
    public class CustomerController : Controller
    {
        private IUserService userService;
        private IRoleService roleService;
        private IOrderService orderService;
        private IProductService productService;
        private IAttributeVariationService attributeVariationService;
        private IOptions<AppSettings> settings;
        private IWebHostEnvironment hostEnvironment;

        public CustomerController(IUserService userService, IOrderService orderService, IProductService productService, 
            IRoleService roleService, IAttributeVariationService attributeVariationService, IOptions<AppSettings> settings, IWebHostEnvironment hostEnvironment)
        {
            this.userService = userService;
            this.productService = productService;
            this.orderService = orderService;
            this.roleService = roleService;
            this.attributeVariationService = attributeVariationService;
            this.settings = settings;
            this.hostEnvironment = hostEnvironment;

        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult OrderList()
        {
            return View();
        }

        public ActionResult OrderConfirm()
        {
            return View();
        }

        public ActionResult PaymentCancel()
        {
            return View();
        }

        public ActionResult OrderDetails()
        {
            return View();
        }

        public ActionResult EditAddress()
        {
            return View();
        }

        public ActionResult ChangePassword()
        {
            return View();
        }

        //public string GetCustomerId(User userToSave)
        //{
        //    string customerId = String.Empty;

        //    try
        //    {
        //        var user = this.userService.GetUserByPhone(userToSave.Username);
        //        if (user != null)
        //        {
        //            customerId = user.Id;

        //            user.FirstName = userToSave.FirstName;
        //            user.LastName = userToSave.LastName;                    
        //            user.ShipCountry = userToSave.ShipCountry;
        //            user.ShipCity = userToSave.ShipCity;
        //            user.ShipState = userToSave.ShipState;
        //            user.ShipZipCode = userToSave.ShipZipCode;
        //            user.ShipAddress = userToSave.ShipAddress;

        //            this.userService.UpdateUserInfo(user);
        //        }
        //        else
        //        {
        //            User newUser = new User();
        //            customerId = Guid.NewGuid().ToString();

        //            Role memberRole = this.roleService.GetRole(ERoleName.customer.ToString());

        //            newUser.Id = customerId;
        //            newUser.Username = userToSave.Username;
        //            newUser.Password = userToSave.Username;
        //            newUser.FirstName = userToSave.FirstName;
        //            newUser.LastName = userToSave.LastName;                    
        //            newUser.ShipCountry = userToSave.ShipCountry;
        //            newUser.ShipCity = userToSave.ShipCity;
        //            newUser.ShipState = userToSave.ShipState;
        //            newUser.ShipZipCode = userToSave.ShipZipCode;
        //            newUser.ShipAddress = userToSave.ShipAddress;

        //            newUser.IsActive = true;
        //            newUser.IsVerified = true;
        //            newUser.IsDelete = false;
        //            newUser.CreateDate = DateTime.Now;
        //            newUser.Roles.Add(memberRole);

        //            this.userService.CreateUser(newUser);
        //        }
        //    }
        //    catch
        //    {
        //        customerId = String.Empty;
        //    }

        //    return customerId;
        //}

        [HttpPost]
        public JsonResult PlaceOrder([FromBody] Order order)
        {
            string orderId = Guid.NewGuid().ToString();
            string orderCode = DateTime.Now.Ticks.ToString();

            bool isSuccess = false;
            try
            {
                string customerId = AppUtils.GetLoggedInUserId();

                // nullify the user object
                order.User = null;

                string loggedInUserName = String.Empty;
                var loggedInUser = AppUtils.GetLoggedInUser();
                if (loggedInUser != null)
                {
                    loggedInUserName = loggedInUser.FirstName + " " + loggedInUser.LastName;
                }

                order.Id = orderId;
                order.OrderCode = orderCode;
                order.UserId = customerId;
                order.DueAmount = 0;
                order.Discount = 0; // Always 0 because discount is already reduced from price
                order.ActionDate = DateTime.Now;
                order.ActionBy = loggedInUserName;

                foreach (var item in order.OrderItems)
                {
                    item.OrderId = orderId;
                    item.Id = Guid.NewGuid().ToString();
                    item.ActionDate = DateTime.Now;
                    item.CostPrice = this.productService.GetCostPrice(item.ProductId);
                }

                this.orderService.CreateOrder(order);
                isSuccess = true;

                // Update inventory stock
                foreach (var item in order.OrderItems)
                {
                    this.productService.MinusStockQty(item.ProductId, item.Quantity);
                }

                // Update sold count
                foreach (var item in order.OrderItems)
                {
                    this.productService.UpdateSoldCount(item.ProductId);
                }

                // Generate order barcode
                AppCommon.GenerateOrderBarcode(hostEnvironment, order.OrderCode);                

            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new
            {
                isSuccess = isSuccess,
                orderId = orderId,
                orderCode = orderCode
            });
        }               

        public JsonResult GetOrderList()
        {
            List<OrderViewModel> orderVMList = new List<OrderViewModel>();

            if (AppUtils.GetLoggedInUser() != null)
            {
                string userId = AppUtils.GetLoggedInUser().Id;
                var orderList = this.orderService.GetOrders(userId);

                foreach (var item in orderList)
                {
                    OrderViewModel order = new OrderViewModel();
                    order.Id = item.Id;
                    order.OrderCode = item.OrderCode;
                    order.Discount = item.Discount;
                    order.DueAmount = item.DueAmount;
                    order.PayAmount = item.PayAmount;
                    order.OrderMode = item.OrderMode;
                    order.OrderStatus = item.OrderStatus;
                    order.PaymentStatus = item.PaymentStatus;
                    order.PaymentType = item.PaymentType;
                    order.Vat = item.Vat;
                    order.ActionDate = item.ActionDate;
                    order.ActionDateString = Utils.GetFormattedDate(item.ActionDate);

                    orderVMList.Add(order);
                }
            }

            return Json(orderVMList);
        }

        public JsonResult GetOrderDetails(string orderId)
        {
            OrderViewModel orderVM = new OrderViewModel();

            var order = this.orderService.GetOrder(orderId);
            if (order != null)
            {                
                orderVM.Id = order.Id;
                orderVM.UserId = order.UserId;
                orderVM.BranchId = order.BranchId;
                orderVM.OrderCode = order.OrderCode;
                orderVM.OrderStatus = order.OrderStatus;
                orderVM.OrderMode = order.OrderMode;
                orderVM.PayAmount = order.PayAmount;
                orderVM.Discount = order.Discount;
                orderVM.Vat = order.Vat;
                orderVM.ShippingAmount = order.ShippingAmount;
                orderVM.DueAmount = order.DueAmount;
                orderVM.ReceiveAmount = order.ReceiveAmount;
                orderVM.ChangeAmount = order.ChangeAmount;
                orderVM.TotalWeight = order.TotalWeight;
                orderVM.DeliveryDate = order.DeliveryDate;
                orderVM.DeliveryTime = order.DeliveryTime;
                orderVM.IsFrozen = order.IsFrozen == null ? false : (bool)order.IsFrozen;
                orderVM.ActionDate = order.ActionDate;
                
                orderVM.OrderItems = new List<ViewModel.OrderItemViewModel>();
                foreach (var oi in order.OrderItems)
                {
                    OrderItemViewModel o = new ViewModel.OrderItemViewModel();
                    o.Id = oi.Id;
                    o.ProductId = oi.ProductId;
                    o.ProductName = oi.Title;
                    o.Price = oi.Price;
                    o.Discount = oi.Discount;
                    o.Quantity = oi.Quantity;                    
                    o.CostPrice = oi.CostPrice == null ? oi.Price : (decimal)oi.CostPrice;
                    o.ImageUrl = String.IsNullOrEmpty(oi.ImageUrl) ? "/Images/no-image.png" : oi.ImageUrl;
                    o.ActionDate = oi.ActionDate;
                    orderVM.OrderItems.Add(o);
                }                
            }

            return Json(orderVM);
        }

        private string SetStripeSession(string orderId, string orderCode, double amount)
        {
            /*
            // Order currency
            string currency = Utils.GetStripeCurrency();

            // Stripe secret key
            string secretKey = Utils.GetStripeSecretKey();

            StripeConfiguration.ApiKey = secretKey;

            //string scheme = System.Web.HttpContext.Current.Request.Url.Scheme;
            //string hostName = System.Web.HttpContext.Current.Request.Url.Host;

            string scheme = AppHttpContext.Current.Request.Scheme;
            string hostName = AppHttpContext.Current.Request.Host.Host;

            hostName += (hostName == "localhost") ? ":" + AppHttpContext.Current.Request.Host.Port : "";

            string baseUrl = scheme + "://" + hostName;

            string keyInfo = orderId + "_" + orderCode + "_" + amount.ToString();

            // Customer name
            string customerName = String.Empty;
            var user = AppUtils.GetLoggedInUser();
            if(user != null)
            {
                customerName = user.FirstName + " " + user.LastName;
            }

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> {
                    "card",
                },
                LineItems = new List<SessionLineItemOptions> {
                                new SessionLineItemOptions {
                                    Name = customerName,
                                    Description = "Online Payment",
                                    Amount = long.Parse(amount.ToString())  * 100, // amount in cents
                                    Currency = currency,
                                    Quantity = 1,
                                },
                            },


                SuccessUrl = baseUrl + "/Customer/PaymentSuccess_Stripe?keyInfo=" + keyInfo,
                CancelUrl = baseUrl + "/Customer/PaymentCancel_Stripe",
            };

            try
            {
                var service = new SessionService();
                Session session = service.Create(options);
                return session.Id;
            }
            catch (Exception exp)
            {
                return String.Empty;
            }
            */

            return "";

        }

        public JsonResult CardPayment(string orderId, string orderCode, double amount)
        {
            bool isSuccess = true;
            string sessionId = String.Empty;

            try
            {
                sessionId = SetStripeSession(orderId, orderCode, amount);
            }
            catch (Exception exp)
            {                
                isSuccess = false;
            }

            return Json(new
            {
                isSuccess = isSuccess,
                sessionId = sessionId
            });
        }

        public ActionResult PaymentSuccess_Stripe(string keyInfo)
        {
            string orderId = String.Empty;
            string orderCode = String.Empty;
            string amount = String.Empty;

            string[] data = keyInfo.Split('_');
            if(data.Length == 3)
            {
                orderId = data[0];
                orderCode = data[1];
                amount = data[2];
            }

            // Update payment status to 'Done'
            orderService.OrderPaymentDone(orderId);            

            // Redirect to confirmation page
            return RedirectToAction("OrderConfirm", "Customer", new { orderCode = orderCode });
        }

        public ActionResult PaymentCancel_Stripe()
        {
            return RedirectToAction("PaymentCancel", "Customer");            
        }
    }
}