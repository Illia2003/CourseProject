using Application.Service;
using Application.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Application.Common;
using Application.Model.Models;
using System.Web.Helpers;
using System.Web.Hosting;
using Application.Notification;
using Application.Logging;
using System.Transactions;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    public class PurchaseController : Controller
    {
        private IPurchaseService purchaseService;
        private IProductService productService;
        private IProductStockService productStockService;
        private IProductImageService productImageService;
        private IPurchaseProductStockService purchaseProductStockService;

        public PurchaseController(IPurchaseService purchaseService, IProductService productService, IProductImageService productImageService, IPurchaseProductStockService purchaseProductStockService, IProductStockService productStockService)
        {
            this.purchaseService = purchaseService;
            this.productService = productService;
            this.productImageService = productImageService;
            this.purchaseProductStockService = purchaseProductStockService;
            this.productStockService = productStockService;
        }

        public ActionResult PurchaseProduct()
        {
            return View();
        }

        public ActionResult PurchaseList()
        {
            return View();
        }

        public ActionResult ProductSupplierList()
        {
            return View();
        }

        public ActionResult ProductStock()
        {
            return View();
        }

        public ActionResult LowStockEnty()
        {
            return View();
        }

        public ActionResult LowStockList()
        {
            return View();
        }

        public ActionResult PurchaseHistory()
        {
            return View();
        }

        public JsonResult GetProductStockList(int stockLocationId)
        {
            string userId = Utils.GetLoggedInUserId();
            var imageSrcPrefix = Utils.GetProductImageSrcPrefix() + "/Small/";
            List<ProductViewModel> productVMList = new List<ProductViewModel>();

            if (!String.IsNullOrEmpty(userId))
            {
                var productList = this.productStockService.GetProductStocks(stockLocationId);
                foreach (ProductStock productStock in productList)
                {
                    ProductViewModel productVM = new ProductViewModel();

                    productVM.Id = productStock.ProductId;
                    productVM.Title = productStock.Product.Title;
                    productVM.Barcode = productStock.Product.Barcode;
                    productVM.Quantity = productStock.Quantity == null ? 0 : (int)productStock.Quantity;
                    
                    // Get user images
                    List<ProductImageViewModel> imageVMList = new List<ProductImageViewModel>();
                    var imageList = this.productImageService.GetProductImages(productStock.ProductId, true);
                    foreach (ProductImage image in imageList)
                    {
                        if (image.IsPrimaryImage)
                        {
                            productVM.PrimaryImageName = imageSrcPrefix + image.ImageName;
                            break;
                        }
                    }

                    if (String.IsNullOrEmpty(productVM.PrimaryImageName))
                    {
                        productVM.PrimaryImageName = imageSrcPrefix + "no-image.jpg";
                    }

                    productVMList.Add(productVM);
                }
            }

            return new JsonResult()
            {
                ContentEncoding = Encoding.UTF8,
                ContentType = "application/json",
                Data = productVMList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = int.MaxValue
            };
        }

        public JsonResult GetProductListForLowStockEntry()
        {
            string userId = Utils.GetLoggedInUserId();
            var imageSrcPrefix = Utils.GetProductImageSrcPrefix() + "/Small/";
            List<ProductViewModel> productVMList = new List<ProductViewModel>();

            if (!String.IsNullOrEmpty(userId))
            {
                var productList = this.productService.GetProducts();
                foreach (Product product in productList)
                {
                    ProductViewModel productVM = new ProductViewModel();

                    productVM.Id = product.Id;
                    productVM.Title = product.Title;
                    productVM.Barcode = product.Barcode;
                    productVM.Quantity = product.Quantity == null ? 0 : (int)product.Quantity;

                    // Get user images
                    List<ProductImageViewModel> imageVMList = new List<ProductImageViewModel>();
                    var imageList = this.productImageService.GetProductImages(product.Id, true);
                    foreach (ProductImage image in imageList)
                    {
                        if (image.IsPrimaryImage)
                        {
                            productVM.PrimaryImageName = imageSrcPrefix + image.ImageName;
                            break;
                        }
                    }

                    if (String.IsNullOrEmpty(productVM.PrimaryImageName))
                    {
                        productVM.PrimaryImageName = imageSrcPrefix + "no-image.jpg";
                    }

                    productVMList.Add(productVM);
                }
            }

            return new JsonResult()
            {
                ContentEncoding = Encoding.UTF8,
                ContentType = "application/json",
                Data = productVMList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = int.MaxValue
            };
        }

        public JsonResult GetLowStockProductList()
        {
            string userId = Utils.GetLoggedInUserId();
            var imageSrcPrefix = Utils.GetProductImageSrcPrefix() + "/Small/";

            List<ProductLowStock> lowStockList = new List<ProductLowStock>();

            // Get the low stock list
            string query = @"Select pls.Id as Id, p.Id as ProductId, p.Title as ProductTitle, p.Barcode, p.Quantity, pls.LowStockEntryDate, pls.IsOrder, pls.OrderDate, AddedBy, UpdateBy
                            from Products p, ProductLowStocks pls
                            where p.Id = pls.ProductId 
                            order by LowStockEntryDate desc";
            Application.Data.Models.ApplicationEntities db = new Data.Models.ApplicationEntities();
            using (var context = new Data.Models.ApplicationEntities())
            {
                lowStockList = context.Database.SqlQuery<ProductLowStock>(query).ToList();                
            }
            
            if (!String.IsNullOrEmpty(userId))
            {
                foreach (var item in lowStockList)
                {
                    // Get user images
                    List<ProductImageViewModel> imageVMList = new List<ProductImageViewModel>();
                    var imageList = this.productImageService.GetProductImages(item.ProductId, true);
                    foreach (ProductImage image in imageList)
                    {
                        if (image.IsPrimaryImage)
                        {
                            item.PrimaryImageName = imageSrcPrefix + image.ImageName;
                            break;
                        }
                    }

                    if (String.IsNullOrEmpty(item.PrimaryImageName))
                    {
                        item.PrimaryImageName = imageSrcPrefix + "no-image.jpg";
                    }                    
                }
            }

            return new JsonResult()
            {
                ContentEncoding = Encoding.UTF8,
                ContentType = "application/json",
                Data = lowStockList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = int.MaxValue
            };
        }

        public JsonResult SavePurchase(PurchaseInvoice purchaseVM) 
        {
            bool isSuccess = true;
            string message = String.Empty;
            using (TransactionScope tran = new TransactionScope())
            {
                try
                {                   
                    foreach (var item in purchaseVM.ItemList)
                    {
                        if (String.IsNullOrEmpty(item.ProductId) || item.Quantity < 1)
                        {
                            continue;
                        }

                        string purchaseId = Guid.NewGuid().ToString();

                        Purchase purchase = new Purchase();
                        purchase.Id = purchaseId;
                        purchase.SupplierId = purchaseVM.SupplierId;
                        purchase.PurchaseDate = new DateTime(purchaseVM.PurchaseDate.Year, purchaseVM.PurchaseDate.Month, purchaseVM.PurchaseDate.Day, purchaseVM.PurchaseDate.Hour, purchaseVM.PurchaseDate.Minute, purchaseVM.PurchaseDate.Second);
                        purchase.InvoiceNo = purchaseVM.InvoiceNo;
                        purchase.ProductId = item.ProductId;
                        purchase.Quantity = item.Quantity;
                        purchase.Unit = item.Unit;
                        purchase.UnitPrice = item.UnitPrice;
                        purchase.TaxPerc = item.TaxPerc;
                        purchase.TaxAmount = item.TaxAmount;
                        purchase.ActionDate = DateTime.Now;
                        purchase.ActionBy = User.Identity.Name;
                        this.purchaseService.CreatePurchase(purchase);
                        
                        // Save to purchase product stocks and update to total stocks under product and stocks
                        foreach (var stock in item.StockList)
                        {
                            if (stock.Quantity > 0)
                            {
                                // Save purchase wise product stocks
                                PurchaseProductStock pps = new PurchaseProductStock();
                                pps.Id = Guid.NewGuid().ToString();
                                pps.PurchaseId = purchaseId;
                                pps.SupplierId = purchase.SupplierId;
                                pps.ProductId = purchase.ProductId;
                                pps.StockLocationId = stock.StockLocationId;
                                pps.Quantity = stock.Quantity;
                                pps.PurchaseDate = purchase.PurchaseDate;
                                this.purchaseProductStockService.CreatePurchaseProductStock(pps);

                                // Update total product stocks
                                ProductStock ps = new ProductStock();
                                ps.Id = Guid.NewGuid().ToString();
                                ps.ProductId = purchase.ProductId;
                                ps.StockLocationId = stock.StockLocationId;
                                ps.Quantity = stock.Quantity;
                                this.productStockService.SaveProductStock(ps);
                            }
                        }
                    }

                    // Complete the transaction
                    tran.Complete();
                }
                catch (Exception ex)
                {
                    isSuccess = false;
                    message = ex.Message;
                    ErrorLog.LogError(ex);
                }
            }

            return Json(new Result { IsSuccess = isSuccess, Message = message }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateStoreQuantity(int stockLocationId, string productId, int oldQuantity, int newQuantity)
        {
            bool isSuccess = true;
            try
            {
                this.productStockService.UpdateProductStock(stockLocationId, productId, newQuantity);

                //Insert record to manual update history table
                ProductStockManualUpdateHistoryAdd(stockLocationId, productId, oldQuantity, newQuantity);
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex, "Failed to update quantity!");
            }

            return Json(new Result { IsSuccess = isSuccess }, JsonRequestBehavior.AllowGet);
        }

        public void ProductStockManualUpdateHistoryAdd(int stockLocationId, string productId, int oldQuantity, int newQuantity)
        {
            string remarks = String.Format("Qty update: {0} to {1}", oldQuantity, newQuantity);
            string query = String.Format(@" Insert Into ProductStockManualUpdateHistory(ProductId, StockLocationId, Quantity, Remarks, ActionDate, ActionBy)
                                            Values('{0}',{1},{2},'{3}','{4}','{5}')", productId, stockLocationId, newQuantity, remarks, DateTime.Now, User.Identity.Name);

            Application.Data.Models.ApplicationEntities db = new Data.Models.ApplicationEntities();
            using (var context = new Data.Models.ApplicationEntities())
            {
                context.Database.ExecuteSqlCommand(query);
            }
        }

        public JsonResult AddToLowStock(string productId)
        {
            bool isSuccess = true;
            string query = String.Format(@"Insert Into ProductLowStocks(ProductId, LowStockEntryDate, AddedBy, IsOrder) Values ('{0}', '{1}', '{2}', 0)", productId, DateTime.Now, User.Identity.Name);

            try
            {
                Application.Data.Models.ApplicationEntities db = new Data.Models.ApplicationEntities();
                using (var context = new Data.Models.ApplicationEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            catch
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult OrderLowStock(string id) 
        {
            bool isSuccess = true;
            string query = String.Format(@"Update ProductLowStocks Set IsOrder = 1, UpdateBy = '{0}', OrderDate = '{1}' Where Id = '{2}'", User.Identity.Name, DateTime.Now, id);

            try
            {
                Application.Data.Models.ApplicationEntities db = new Data.Models.ApplicationEntities();
                using (var context = new Data.Models.ApplicationEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            catch
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPurchaseList(string fromDate, string toDate, int? supplierId)
        {
            List<PurchaseViewModel> orderList = GetPurchaseListData(fromDate, toDate, supplierId);
            return Json(orderList, JsonRequestBehavior.AllowGet);
        }

        private List<PurchaseViewModel> GetPurchaseListData(string fromDate, string toDate, int? supplierId)
        {
            toDate = toDate + " 23:59:59";
            string query = String.Format(@" select prod.Id as ProductId, prod.Title as ProductName, s.Name as SupplierName, p.InvoiceNo,
                                            p.Quantity, p.TaxPerc, p.UnitPrice, p.Unit, 
                                            (p.Quantity * p.UnitPrice) as TotalPriceExcTax, 
                                            (p.Quantity * (p.UnitPrice + (p.UnitPrice * p.TaxPerc)/ 100)) as TotalPriceIncTax, 
                                            p.PurchaseDate, convert(varchar, p.PurchaseDate, 100) as PurchaseDateString, p.ActionDate 
                                            from Purchase p, products prod, Suppliers s
                                            where p.ProductId = prod.Id
                                            and p.SupplierId = s.Id                                            
                                            and p.PurchaseDate between '{0}' and '{1}'", fromDate, toDate);

            string orderByClause = " Order by p.ActionDate desc";
            string andClause = String.Empty;

            if (supplierId != null)
            {
                andClause += String.Format(" and p.supplierId = {0}", supplierId);
            }

            if (!String.IsNullOrEmpty(andClause))
            {
                query += andClause;
            }

            query += orderByClause;

            Application.Data.Models.ApplicationEntities db = new Data.Models.ApplicationEntities();
            using (var context = new Data.Models.ApplicationEntities())
            {
                var purchaseList = context.Database.SqlQuery<PurchaseViewModel>(query).ToList();
                if (purchaseList != null && purchaseList.Count > 0)
                {
                    return purchaseList;
                }
            }

            return new List<PurchaseViewModel>();
        }

        public JsonResult GetPurchaseHistory(int stockLocationId, string productId)
        {
            List<PurchaseHistory> list = new List<PurchaseHistory>();
            string query = String.Format(@" Select pps.PurchaseDate as PurchaseDate, convert(varchar, pps.PurchaseDate, 100) as PurchaseDateString, pps.Quantity, p.UnitPrice, p.TaxPerc, 'Purchase' as Remarks, s.Name as SupplierName, p.InvoiceNo, p.ActionBy
                                            from PurchaseProductStocks pps, Purchase p, Suppliers s
                                            where pps.PurchaseId = p.Id
                                            and pps.SupplierId = s.Id
                                            and pps.ProductId = '{0}'
                                            and pps.StockLocationId = {1}

                                            UNION

                                            select psmuh.ActionDate as PurchaseDate, convert(varchar, psmuh.ActionDate, 100) as PurchaseDateString, psmuh.Quantity, NULL as UnitPrice, NULL as TaxPerc, Remarks, '-' as SupplierName, '-' as InvoiceNo, psmuh.ActionBy
                                            from ProductStockManualUpdateHistory psmuh
                                            where psmuh.ProductId = '{0}'
                                            and psmuh.StockLocationId = {1}", productId, stockLocationId);

            string orderByClause = " Order by PurchaseDate desc";
            query += orderByClause;

            Application.Data.Models.ApplicationEntities db = new Data.Models.ApplicationEntities();
            using (var context = new Data.Models.ApplicationEntities())
            {
                list = context.Database.SqlQuery<PurchaseHistory>(query).ToList();
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductList()
        {
            List<ProductInfo> pvmList = new List<ProductInfo>();
            var productList = this.productService.GetProducts();
            if (productList != null)
            {
                foreach (var item in productList)
                {
                    ProductInfo p = new ProductInfo();
                    p.Id = item.Id;
                    p.Barcode = item.Barcode;
                    p.Name = item.Title;
                    pvmList.Add(p);
                }
            }

            return Json(pvmList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPriceAndStock(int supplierId, string productId)
        {
            PriceAndStock priceStock = new PriceAndStock();

            // Get the latest price
            string query = String.Format(@"select UnitPrice from Purchase where ProductId = '{0}' and SupplierId = {1} order by PurchaseDate desc", productId, supplierId);            
            Application.Data.Models.ApplicationEntities db = new Data.Models.ApplicationEntities();
            using (var context = new Data.Models.ApplicationEntities())
            {
                var price = context.Database.SqlQuery<decimal>(query).FirstOrDefault();
                priceStock.LastPurchasePrice = price;              
            }
            

            // Get the product's current stocks
            query = String.Format(@"select sl.Id as StockLocationId, sl.Name as StockLocationName, ISNULL (ps.Quantity, 0) as CurrentQuantity from StockLocations sl left outer join ProductStocks ps on sl.Id = ps.StockLocationId and ps.ProductId = '{0}'", productId);            
            using (var context = new Data.Models.ApplicationEntities())
            {
                List<ProductStockViewModel> productStockList = context.Database.SqlQuery<ProductStockViewModel>(query).ToList();
                priceStock.StockList = productStockList;
            }

            return Json(priceStock, JsonRequestBehavior.AllowGet);
        }

    }

    public class ProductInfo
    {
        public string Id { get; set; }
        public string Barcode { get; set; }   
        public string Name { get; set; }        
    }

    public class PriceAndStock
    {
        public string ProductId { get; set; }
        public decimal LastPurchasePrice { get; set; }
        public List<ProductStockViewModel> StockList { get; set; }
    }

    public class PurchaseInvoice
    {
        public int SupplierId { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string InvoiceNo { get; set; }
        public List<PurchaseViewModel> ItemList { get; set; }
    }

    public class PurchaseHistory
    {
        public DateTime PurchaseDate { get; set; }
        public string PurchaseDateString { get; set; }
        public string InvoiceNo { get; set; }
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? TaxPerc { get; set; }
        public string Remarks { get; set; }
        public string SupplierName { get; set; }
        public string ActionBy { get; set; }        
    }

    public class ProductLowStock
    {
        public string Id { get; set; }
        public string ProductId { get; set; }
        public string ProductTitle { get; set; }
        public string Barcode { get; set; }
        public DateTime? LowStockEntryDate { get; set; }
        public DateTime? OrderDate { get; set; }
        public bool IsOrder { get; set; }
        public string AddedBy { get; set; }
        public string UpdateBy { get; set; }
        public string PrimaryImageName { get; set; }
    }

}