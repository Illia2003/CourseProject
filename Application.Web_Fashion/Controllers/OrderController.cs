using Application.Common;
using Application.Data.Models;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web;
using Application.Web.App_Code;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Globalization;
using System.Transactions;

namespace Application.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private IUserService userService;
        private IOrderService orderService;
        private IProductService productService;
        private IProductImageService productImageService;
        private IActionLogService actionLogService;

        public OrderController(IUserService userService, IOrderService orderService, IProductService productService, IProductImageService productImageService, IActionLogService actionLogService)
        {
            this.userService = userService;
            this.orderService = orderService;
            this.productService = productService;
            this.productImageService = productImageService;
            this.actionLogService = actionLogService;
        }

        public ActionResult OrderList()
        {
            return View();
        }

        public ActionResult OrderDetails()
        {
            return View();
        }

        public ActionResult SalesReturn()
        {
            return View();
        }

        public JsonResult CompleteOrder(string orderId)
        {
            bool isSuccess = orderService.CompleteOrder(orderId);

            return Json(new
            {
                isSuccess = isSuccess
            });
        }

        public JsonResult GetOrderList(int? branchId, string fromDate, string toDate, string orderStatus, string orderMode)
        {
            DateTime dtFrom;
            DateTime dtTo;

            if (String.IsNullOrEmpty(fromDate) || String.IsNullOrEmpty(toDate))
            {
                dtFrom = DateTime.Now.AddDays(-30);
                dtTo = DateTime.Now.AddDays(1);
            }
            else
            {
                dtFrom = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                dtTo = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture).AddTicks(-1).AddDays(1);
            }                       

            List<OrderViewModel> orderVMList = new List<OrderViewModel>();

            if (AppUtils.GetLoggedInUser() != null)
            {
                EOrderStatus orderStatusEnum = (EOrderStatus)Enum.Parse(typeof(EOrderStatus), orderStatus);
                EOrderMode orderModeEnum = String.IsNullOrEmpty(orderMode) ? EOrderMode.All : (EOrderMode)Enum.Parse(typeof(EOrderMode), orderMode);

                var orderList = this.orderService.GetOrders(branchId, dtFrom, dtTo, orderStatusEnum, orderModeEnum);

                foreach (var item in orderList)
                {
                    OrderViewModel order = new OrderViewModel();
                    order.Id = item.Id;
                    order.BranchId = item.BranchId;
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

        public JsonResult GetOnlineOrdersForDashboard()
        {
            List<OrderViewModel> orderVMList = new List<OrderViewModel>();

            if (AppUtils.GetLoggedInUser() != null)
            {
                var orderList = this.orderService.GetOnlineOrders(10);
                foreach (var item in orderList)
                {
                    OrderViewModel order = new OrderViewModel();
                    order.Id = item.Id;
                    order.BranchId = item.BranchId;
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
                    order.ActionDateString = Utils.GetFormattedDate(order.ActionDate);

                    orderVMList.Add(order);
                }
            }

            return Json(orderVMList);
        }

        //[AllowAnonymous]
        //public ActionResult PrintOrder(string orderId)
        //{
        //    List<ReportOrderViewModel> list = new List<ReportOrderViewModel>();

        //    string sVat = Utils.GetSetting(ESetting.Vat.ToString());
        //    int vatPerc = String.IsNullOrEmpty(sVat) ? 0 : int.Parse(sVat);

        //    var order = this.orderService.GetOrder(orderId);
        //    if (order != null)
        //    {
        //        var user = this.userService.GetUserById(order.UserId);

        //        if (user != null)
        //        {                    
        //            decimal vatAmount = order.Vat != null ? (decimal)order.Vat : 0;
        //            decimal shippingAmount = order.ShippingAmount != null ? (decimal)order.ShippingAmount : 0;
        //            decimal subTotal = (decimal)order.PayAmount + (decimal)order.Discount - vatAmount - shippingAmount;
        //            decimal discount = (decimal)order.Discount;
        //            decimal grandTotal = (decimal)order.PayAmount;

        //            foreach (var item in order.OrderItems)
        //            {
        //                ReportOrderViewModel r = new ReportOrderViewModel();

        //                decimal itemTotal = (item.Quantity * item.Price);

        //                r.CompanyName = r.CompanyName = Utils.GetSetting(ESetting.CompanyName.ToString());
        //                r.Name = user.FirstName + " " + user.LastName;
        //                r.OrderId = order.OrderCode;
        //                r.Address = user.ShipAddress;
        //                r.Mobile = user.Username;
        //                r.City = user.ShipCity;
        //                r.State = user.ShipState;
        //                r.Country = user.ShipCountry;
        //                r.Zipcode = user.ShipZipCode;
        //                r.RegistrationNo = Utils.GetSetting(ESetting.RegistrationNo.ToString());

        //                r.ProductName = item.Title; //item.ProductId == Guid.Empty.ToString() ? item.Title : item.Product.Title;
        //                r.ProductBarcode = item.Product.Barcode;
        //                r.Quantity = item.Quantity;
        //                r.Price = item.Price;                        
        //                r.ItemTotal = itemTotal;

        //                r.OrderStatus = order.OrderStatus;
        //                r.OrderDate = ((DateTime)order.ActionDate).ToString("dddd, dd MMMM yyyy hh:mm tt");
        //                r.ImageName = item.ImageUrl;
        //                r.SubTotal = subTotal;
        //                r.Discount = discount;
        //                r.VatAmount = vatAmount;
        //                r.ShippingAmount = shippingAmount;
        //                r.GrandTotal = grandTotal;
        //                r.PaymentBy = order.PaymentType;

        //                r.BarcodeImageName = System.Web.HttpContext.Current.Server.MapPath("~") + "/Photos/Barcode/Orders/" + order.OrderCode + ".jpeg";

        //                r.OrderMode = order.OrderMode;
        //                r.TotalWeight = order.TotalWeight != null ? (decimal)order.TotalWeight + " Kg" : "";
        //                r.DeliveryDateTime = order.DeliveryDate + " " + order.DeliveryTime;
        //                r.FrozenItem = order.IsFrozen != null ? ((bool)order.IsFrozen ? "Yes" : "No") : "";

        //                list.Add(r);
        //            }
        //        }
        //    }

        //    // Report
        //    if (list.Count() > 0)
        //    {
        //        ReportDocument rd = new ReportDocument();
        //        rd.Load(Path.Combine(Server.MapPath("~/Reports"), "ProductOrder.rpt"));
        //        rd.SetDataSource(list);

        //        Response.Buffer = false;
        //        Response.ClearContent();
        //        Response.ClearHeaders();

        //        try
        //        {
        //            Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
        //            stream.Seek(0, SeekOrigin.Begin);
        //            return File(stream, "application/pdf", "ProductOrder.pdf");
        //        }
        //        catch (Exception exp)
        //        {
        //            throw exp;
        //        }
        //        finally
        //        {
        //            rd.Close();
        //            rd.Dispose();
        //        }
        //    }

        //    return null;
        //}

        //[AllowAnonymous]
        //public ActionResult PrintInvoice(string orderId)
        //{
        //    List<ReportOrderViewModel> list = new List<ReportOrderViewModel>();

        //    string sVat = Utils.GetSetting(ESetting.Vat.ToString());
        //    int vatPerc = String.IsNullOrEmpty(sVat) ? 0 : int.Parse(sVat);

        //    var order = this.orderService.GetOrder(orderId);
        //    if (order != null)
        //    {
        //        var user = this.userService.GetUserById(order.UserId);

        //        if (user != null)
        //        {
        //            decimal vatAmount = order.Vat != null ? (decimal)order.Vat : 0;
        //            decimal shippingAmount = order.ShippingAmount != null ? (decimal)order.ShippingAmount : 0;
        //            decimal subTotal = (decimal)order.PayAmount + (decimal)order.Discount - vatAmount - shippingAmount;
        //            decimal discount = (decimal)order.Discount;
        //            decimal grandTotal = (decimal)order.PayAmount;

        //            // Sort the order based on title
        //            order.OrderItems = order.OrderItems.OrderBy(r => r.Product.Title).ToList();

        //            foreach (var item in order.OrderItems)
        //            {
        //                ReportOrderViewModel r = new ReportOrderViewModel();

        //                decimal itemTotal = (item.Quantity * item.Price);

        //                r.CompanyName = Utils.GetSetting(ESetting.CompanyName.ToString());
        //                r.CompanyAddress = Utils.GetSetting(ESetting.CompanyAddress.ToString());
        //                r.CompanyAddress1 = Utils.GetSetting(ESetting.CompanyAddress1.ToString());
        //                r.CompanyPhone = Utils.GetSetting(ESetting.CompanyPhone.ToString());
        //                r.FooterLine1 = Utils.GetSetting(ESetting.FooterLine1.ToString());                        
        //                r.FooterLine2 = Utils.GetSetting(ESetting.FooterLine2.ToString());
        //                r.RegistrationNo = Utils.GetSetting(ESetting.RegistrationNo.ToString());
        //                r.OrderId = order.OrderCode;

        //                r.ProductName = item.ProductId == Guid.Empty.ToString() ? item.Title : item.Product.Title;
        //                r.ProductBarcode = item.Product.Barcode;
        //                r.Quantity = item.Quantity;
        //                r.Price = item.Price;
        //                r.ItemTotal = itemTotal;

        //                r.OrderStatus = order.OrderStatus;
        //                r.OrderDate = ((DateTime)order.ActionDate).ToString("dddd, dd MMMM yyyy hh:mm tt");
        //                r.ImageName = item.ImageUrl;
        //                r.SubTotal = subTotal;
        //                r.Discount = discount;
        //                r.VatAmount = vatAmount;
        //                r.ShippingAmount = shippingAmount;
        //                r.GrandTotal = grandTotal;
        //                r.PaymentBy = order.PaymentType;

        //                r.BarcodeImageName = System.Web.HttpContext.Current.Server.MapPath("~") + "/Photos/Barcode/Orders/" + order.OrderCode + ".jpeg";
        //                r.CompanyLogo = System.Web.HttpContext.Current.Server.MapPath("~") + "/Images/Logo/Logo.png";                        

        //                r.OrderMode = order.OrderMode;
        //                r.TotalWeight = order.TotalWeight != null ? (decimal)order.TotalWeight + " Kg" : "";
        //                r.DeliveryDateTime = order.DeliveryDate + " " + order.DeliveryTime;
        //                r.FrozenItem = order.IsFrozen != null ? ((bool)order.IsFrozen ? "Yes" : "No") : "";

        //                list.Add(r);
        //            }
        //        }
        //    }

        //    // Report
        //    if (list.Count() > 0)
        //    {
        //        ReportDocument rd = new ReportDocument();
        //        rd.Load(Path.Combine(Server.MapPath("~/Reports"), "OrderInvoice.rpt"));
        //        rd.SetDataSource(list);

        //        Response.Buffer = false;
        //        Response.ClearContent();
        //        Response.ClearHeaders();

        //        try
        //        {
        //            Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
        //            stream.Seek(0, SeekOrigin.Begin);
        //            return File(stream, "application/pdf", "OrderInvoice.pdf");
        //        }
        //        catch (Exception exp)
        //        {
        //            throw exp;
        //        }
        //        finally
        //        {
        //            rd.Close();
        //            rd.Dispose();
        //        }
        //    }

        //    return null;
        //}

        [HttpPost]
        public JsonResult UpdateOrder()
        {
            bool isSuccess = false;
            string sql = String.Empty;
            string actionBy = (User.Identity != null) ? User.Identity.Name : String.Empty;
            string orderJson = String.Empty;
            var form = Request.Form;

            foreach (var key in form.Keys)
            {
                if (key == "product")
                {
                    form.TryGetValue(key, out StringValues formValues);
                    orderJson = formValues.ToString();
                    break;
                }
            }

            if (String.IsNullOrEmpty(orderJson))
            {
                return Json(new
                {
                    isSuccess = false,
                    message = "Product information not found!"
                });
            }

            Order order = JsonConvert.DeserializeObject<Order>(orderJson);

            if(order == null)
            {
                return Json(false);
            }

            using (TransactionScope tran = new TransactionScope())
            {
                try
                {
                    // First delete the current order and then create a new order
                    Order orderExist = this.orderService.GetOrder(order.Id);
                    if (orderExist != null)
                    {
                        // Restore inventory stock
                        foreach (var item in orderExist.OrderItems)
                        {
                            this.productService.AddStockQty(item.ProductId, item.Quantity);
                        }

                        // Delete order                            
                        this.orderService.DeleteOrder(orderExist);
                        order.Id = Guid.NewGuid().ToString();
                    }

                    // Assign order id to all order items
                    foreach (var item in order.OrderItems)
                    {
                        item.OrderId = order.Id;
                        item.Id = Guid.NewGuid().ToString();
                    }

                    // Creating order (Save data to Orders and OrderItems table)

                    if (order.OrderMode == "Online")
                    {
                        sql = String.Format(@"Insert Into Orders (Id,UserId,OrderCode,Barcode,PayAmount,DueAmount,Discount,Vat,ShippingAmount,OrderMode,OrderStatus,PaymentType,ActionDate,ActionBy,DeliveryDate,DeliveryTime,TotalWeight,IsFrozen) 
                                                  Values ('{0}','{1}',{2},'{3}',{4},{5},{6},{7},{8},'{9}','{10}','{11}','{12}','{13}','{14}','{15}',{16},{17})",
                                            order.Id, order.UserId, order.OrderCode, order.Barcode, order.PayAmount, order.DueAmount, order.Discount, order.Vat, order.ShippingAmount, order.OrderMode, order.OrderStatus, order.PaymentType, order.ActionDate, actionBy, order.DeliveryDate, order.DeliveryTime, order.TotalWeight, (bool)order.IsFrozen ? 1 : 0);
                    }
                    else
                    {
                        if (order.BranchId == null)
                        {
                            sql = String.Format(@"Insert Into Orders (Id,UserId,OrderCode,Barcode,PayAmount,DueAmount,Discount,Vat,ShippingAmount,ReceiveAmount,ChangeAmount,OrderMode,OrderStatus,PaymentStatus,PaymentType,ActionDate,ActionBy,DeliveryDate,DeliveryTime,TotalWeight,IsFrozen) 
                                                  Values ('{0}','{1}','{2}','{3}',{4},{5},{6},{7},{8},{9},{10},'{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}',{19},{20})", order.Id, order.UserId, order.OrderCode, order.Barcode, order.PayAmount, order.DueAmount, order.Discount, order.Vat, order.ShippingAmount, order.ReceiveAmount, order.ChangeAmount, order.OrderMode, order.OrderStatus, order.PaymentStatus, order.PaymentType, order.ActionDate, actionBy, order.DeliveryDate, order.DeliveryTime, order.TotalWeight, (bool)order.IsFrozen ? 1 : 0);
                        }
                        else
                        {
                            sql = String.Format(@"Insert Into Orders (Id,UserId,BranchId,OrderCode,Barcode,PayAmount,DueAmount,Discount,Vat,ShippingAmount,ReceiveAmount,ChangeAmount,OrderMode,OrderStatus,PaymentStatus,PaymentType,ActionDate,ActionBy,DeliveryDate,DeliveryTime,TotalWeight,IsFrozen) 
                                                  Values ('{0}','{1}',{2},'{3}','{4}',{5},{6},{7},{8},{9},{10},{11},'{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}',{20},{21})", order.Id, order.UserId, order.BranchId, order.OrderCode, order.Barcode, order.PayAmount, order.DueAmount, order.Discount, order.Vat, order.ShippingAmount, order.ReceiveAmount, order.ChangeAmount, order.OrderMode, order.OrderStatus, order.PaymentStatus, order.PaymentType, order.ActionDate, actionBy, order.DeliveryDate, order.DeliveryTime, order.TotalWeight, (bool)order.IsFrozen ? 1 : 0);
                        }
                    }

                    int result = 0;
                    using (var context = new ApplicationEntities(Utils.GetContextOptions()))
                    {
                        result = context.Database.ExecuteSqlRaw(sql);

                        if (result > 0)
                        {
                            foreach (var item in order.OrderItems)
                            {
                                string title = (item.ProductId == "00000000-0000-0000-0000-000000000000") ? item.Title : String.Empty;

                                sql = String.Format(@"Insert Into OrderItems (Id,OrderId,ProductId,Quantity,Discount,Price,TotalPrice,ImageUrl,ActionDate,Title,CostPrice)
                                Values('{0}','{1}','{2}',{3},{4},{5},{6},'{7}','{8}','{9}', {10})", item.Id, item.OrderId, item.ProductId, item.Quantity, item.Discount, item.Price, item.TotalPrice, item.ImageUrl, item.ActionDate, title, item.CostPrice);

                                context.Database.ExecuteSqlRaw(sql);
                            }
                        }
                    }

                    // Update inventory stock
                    foreach (var item in order.OrderItems)
                    {
                        this.productService.MinusStockQty(item.ProductId, item.Quantity);
                    }

                    // Write action log
                    AppCommon.WriteActionLog(actionLogService, "Order", "Update " + order.OrderMode, "Order Amount: " + order.PayAmount.ToString(), "Update", User.Identity.Name);

                    tran.Complete();
                    tran.Dispose();
                    isSuccess = true;
                }
                catch (Exception exp)
                {
                    tran.Dispose();
                    isSuccess = false;
                }
            }

            return Json(isSuccess);
        }

        public JsonResult DeleteOrder(string orderIds)
        {
            string sql = String.Empty;
            string actionBy = (User.Identity != null) ? User.Identity.Name : String.Empty;
            string message = String.Empty;

            string[] ids = orderIds.Split(',');
            string deletedOrderCodes = String.Empty;

            if(!User.IsInRole(ERoleName.admin.ToString())){
                message = "Only administrator are allowed to delete orders!";

                return Json(new
                {
                    message = message,
                    deletedOrderCodes = deletedOrderCodes

                });        
            }

            foreach (string id in ids)
            {
                if (String.IsNullOrEmpty(id)) continue;

                using (TransactionScope tran = new TransactionScope())
                {
                    try
                    {
                        // First delete the current order and then create a new order
                        Order orderExist = this.orderService.GetOrder(id);
                        if (orderExist != null)
                        {                            
                            // Delete order                            
                            this.orderService.DeleteOrder(orderExist);
                        }

                        deletedOrderCodes += orderExist.OrderCode + ",";

                        tran.Complete();
                        tran.Dispose();                        
                    }
                    catch (Exception exp)
                    {
                        tran.Dispose();                        
                    }
                }
            }

            deletedOrderCodes = !String.IsNullOrEmpty(deletedOrderCodes) ? deletedOrderCodes.TrimEnd(',') : deletedOrderCodes;
            AppCommon.WriteActionLog(actionLogService, "Order", "Delete Orders (" + deletedOrderCodes + ")", "Order Codes: " + deletedOrderCodes, "Delete", User.Identity.Name);

            return Json(new
            {
                message = message,
                deletedOrderCodes = deletedOrderCodes

            });            
        }
    }

    public class OrderTest
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}