using Application.Common;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
//using Application.Web.ReportViewModel;
//using CrystalDecisions.CrystalReports.Engine;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Application.Controllers
{
    [Authorize]
    public class ReportController : Controller
    {
        private IUserService userService;
        private IOrderService orderService;
        private IActionLogService actionLogService;
        private IProductImageService productImageService;

        public ReportController(IUserService userService, IOrderService orderService, IProductImageService productImageService, IActionLogService actionLogService)
        {
            this.userService = userService;
            this.orderService = orderService;
            this.actionLogService = actionLogService;
            this.productImageService = productImageService;
        }

        public ActionResult SaleSummary()
        {
            return View();
        }

        public ActionResult DailySales()
        {
            return View();
        }

        public ActionResult MonthlySalesChart()
        {
            return View();
        }

        public ActionResult DailySalesChart()
        {
            return View();
        }

        public ActionResult ActivityLog()
        {
            return View();
        }

        public JsonResult GetActionLogHistory(string fromDate, string toDate)
        {
            List<ActionLog> actionLogList = GetActionLogHistoryData(fromDate, toDate);
            return Json(actionLogList);
        }

        private List<ActionLog> GetActionLogHistoryData(string dateFrom, string dateTo)
        {
            DateTime dtFrom;
            DateTime dtTo;
            DateTime.TryParseExact(dateFrom, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtFrom);
            DateTime.TryParseExact(dateTo, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtTo);

            var actionLogList = this.actionLogService.GetActionLogs(dtFrom, dtTo.AddHours(23).AddMinutes(59).AddSeconds(59)).ToList();
            return actionLogList;
        }

        public JsonResult GetDailySales(int? branchId, string fromDate, string toDate, string orderMode, string orderStatus) 
        {
            List<OrderViewModel> orderList = GetDailySalesData(branchId, fromDate, toDate, orderMode, orderStatus);

            return Json(orderList);
        }

        private List<OrderViewModel> GetDailySalesData(int? branchId, string fromDate, string toDate, string orderMode, string orderStatus)
        {
            toDate = toDate + " 23:59:59";
            string query = String.Format(@"Select Id, OrderCode, OrderMode, OrderStatus, PaymentType, (PayAmount + Discount - Vat - ShippingAmount) as ItemTotal, DueAmount, Discount, Vat, ShippingAmount, PayAmount, ActionDate, convert(varchar, ActionDate, 100) as ActionDateString
                            From Orders 
                            Where ActionDate between '{0}' and '{1}'", fromDate, toDate);

            string orderByClause = " Order by ActionDate desc";
            string andClause = String.Empty;

            if (branchId != null)
            {
                andClause += String.Format(" And BranchId = {0}", branchId);
            }

            if (!String.IsNullOrEmpty(orderMode) && orderMode.ToLower() != "all")
            {
                andClause += String.Format(" And OrderMode = '{0}'", orderMode);
            }

            if (!String.IsNullOrEmpty(orderStatus) && orderStatus.ToLower() != "all")
            {
                andClause += String.Format(" And orderStatus = '{0}'", orderStatus);
            }

            if (!String.IsNullOrEmpty(andClause))
            {
                query += andClause;
            }

            query += orderByClause;

            var orderList = Utils.ExecuteQuery<OrderViewModel>(query).ToList();
            if (orderList != null && orderList.Count > 0)
            {
                foreach (var item in orderList)
                {
                    decimal totalCostPrice = 0;

                    // Get total cost price of an order
                    List<OrderItem> orderItemList = GetOrderItems(item.Id);
                    foreach (var orderItem in orderItemList)
                    {
                        totalCostPrice += orderItem.CostPrice == null ? 0 : ((decimal)orderItem.CostPrice * orderItem.Quantity);
                    }

                    // Calculate profit
                    decimal profit = (decimal)item.PayAmount - totalCostPrice - (decimal)item.Vat - (decimal)item.ShippingAmount;

                    item.TotalCostPrice = totalCostPrice;
                    item.TotalProfit = profit;
                }

                return orderList;
            }

            return new List<OrderViewModel>();
        }

        public JsonResult GetMonthlySellsChart(int? branchId, int year)
        {
            string startDate = year.ToString() + "-01-01";
            string endDate = year.ToString() + "-12-31";

            string storeSubQ = "select ISNULL(sum(PayAmount),0) from Orders where OrderMode = 'Store' and convert(varchar(7), ActionDate, 126) = convert(varchar(7), o.ActionDate, 126)";
            string phoneOrderSubQ = "select ISNULL(sum(PayAmount),0) from Orders where OrderMode = 'PhoneOrder' and convert(varchar(7), ActionDate, 126) = convert(varchar(7), o.ActionDate, 126)";
            string onlineSubQ = "select ISNULL(sum(PayAmount),0) from Orders where OrderMode = 'Online' and convert(varchar(7), ActionDate, 126) = convert(varchar(7), o.ActionDate, 126)";
            string totalSubQ = "select ISNULL(sum(PayAmount),0) from Orders where convert(varchar(7), ActionDate, 126) = convert(varchar(7), o.ActionDate, 126)";

            if (branchId != null)
            {
                storeSubQ += String.Format(" and BranchId = {0}", branchId);
                phoneOrderSubQ += String.Format(" and BranchId = {0}", branchId);
                onlineSubQ += String.Format(" and BranchId = {0}", branchId);
                totalSubQ += String.Format(" and BranchId = {0}", branchId);
            }

            string sqlQuery = String.Empty;

            if (branchId != null)
            {
                sqlQuery = String.Format(@" select convert(varchar(7), ActionDate, 126) as Month,
                                ({0}) as TotalStoreSell,
                                ({1}) as TotalPhoneOrderSell,
                                (0.00) as TotalOnlineSell,
                                ({2}) as TotalSell

                                from Orders o
                                where ActionDate Between '{3}' and '{4}'
                                and BranchId = {5}
                                group by convert(varchar(7), ActionDate, 126) 
                                order by convert(varchar(7), ActionDate, 126) ", storeSubQ, phoneOrderSubQ, totalSubQ, startDate, endDate, branchId);
            }
            else
            {
                sqlQuery = String.Format(@" select convert(varchar(7), ActionDate, 126) as Month,
                                ({0}) as TotalStoreSell,
                                ({1}) as TotalPhoneOrderSell,
                                ({2}) as TotalOnlineSell,
                                ({3}) as TotalSell

                                from Orders o
                                where ActionDate Between '{4}' and '{5}'                                
                                group by convert(varchar(7), ActionDate, 126) 
                                order by convert(varchar(7), ActionDate, 126) ", storeSubQ, phoneOrderSubQ, onlineSubQ, totalSubQ, startDate, endDate);
            }

            var recordList = Utils.ExecuteQuery<MonthlySales>(sqlQuery).ToList();
            return Json(recordList);

        }

        public JsonResult GetDailySellsChart(int? branchId, int month)
        {
            DateTime dtStartDate = new DateTime(DateTime.Now.Year, month, 1);
            var lastDayOfMonth = DateTime.DaysInMonth(dtStartDate.Year, dtStartDate.Month);


            string startDate = dtStartDate.Year.ToString() + "-" + dtStartDate.Month.ToString() + "-" + dtStartDate.Day.ToString();
            string endDate = dtStartDate.Year.ToString() + "-" + dtStartDate.Month.ToString() + "-" + lastDayOfMonth;

            string sqlQuery = String.Empty;

            if (branchId != null)
            {
                sqlQuery = String.Format(@" select CONVERT(varchar(100), convert(DATE, ActionDate)) as Day,
                                                (select ISNULL(sum(PayAmount),0) from Orders where convert(DATE, ActionDate) = convert(DATE, o.ActionDate) and BranchId = {0}) as TotalSell
                                                from Orders o
                                                where ActionDate Between '{1}' and '{2}'
                                                and BranchId = {0}
                                                group by convert(DATE, ActionDate) 
                                                order by convert(DATE, ActionDate) ", branchId, startDate, endDate);
            }
            else
            {
                sqlQuery = String.Format(@" select CONVERT(varchar(100), convert(DATE, ActionDate)) as Day,
                                                (select ISNULL(sum(PayAmount),0) from Orders where convert(DATE, ActionDate) = convert(DATE, o.ActionDate)) as TotalSell                                
                                                from Orders o
                                                where ActionDate Between '{0}' and '{1}'
                                                group by convert(DATE, ActionDate) 
                                                order by convert(DATE, ActionDate) ", startDate, endDate);
            }

            var recordList = Utils.ExecuteQuery<DailySales>(sqlQuery).ToList();
            return Json(recordList);
        }

        private List<OrderItem> GetOrderItems(string orderId)
        {
            List<OrderItem> orderItemList = new List<OrderItem>();
            string query = String.Format(@"Select * from OrderItems where OrderId = '{0}'", orderId);

            orderItemList = Utils.ExecuteQuery<OrderItem>(query).ToList();
            return orderItemList;
        }      
        
        //[AllowAnonymous]
        //public ActionResult PrintOrder(string orderId)
        //{
        //    List<ReportOrderViewModel> list = new List<ReportOrderViewModel>();

        //    int vatPerc = int.Parse(ConfigurationManager.AppSettings["Vat"].ToString());

        //    var order = this.orderService.GetOrder(orderId);
        //    if (order != null)
        //    {
        //        var user = this.userService.GetUserById(order.UserId);

        //        if (user != null)
        //        {
        //            decimal subTotal = 0;
        //            decimal vatAmount = 0;
        //            decimal shippingAmount = 0; //TODO
        //            decimal grandTotal = 0;

        //            foreach (var item in order.OrderItems)
        //            {
        //                ReportOrderViewModel r = new ReportOrderViewModel();

        //                decimal itemTotal = (item.Quantity * item.Price);

        //                r.CompanyName = ConfigurationManager.AppSettings["CompanyName"].ToString();
        //                r.Name = user.FirstName + " " + user.LastName;
        //                r.OrderId = order.Id.ToString();
        //                r.Address = user.ShipAddress;
        //                r.Mobile = user.Username;
        //                r.City = user.ShipCity;
        //                r.State = user.ShipState;
        //                r.Country = user.ShipCountry;
        //                r.Zipcode = user.ShipZipCode;

        //                r.ProductName = item.Product.Title;
        //                r.Quantity = item.Quantity;
        //                r.Price = item.Price;
        //                r.ItemTotal = itemTotal;

        //                subTotal += itemTotal;
        //                vatAmount = Math.Round((subTotal * vatPerc) / 100);
        //                grandTotal = subTotal + vatAmount + shippingAmount;

        //                r.OrderStatus = order.OrderStatus;
        //                r.OrderDate = ((DateTime)order.ActionDate).ToString("dddd, dd MMMM yyyy hh:mm tt");
        //                r.ImageName = item.ImageUrl;
        //                r.SubTotal = subTotal;
        //                r.VatAmount = vatAmount;
        //                r.ShippingAmount = shippingAmount;
        //                r.GrandTotal = grandTotal;

        //                r.PaymentBy = "COD"; // TODO

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

    }   
}