using Application.Common;
using Application.Logging;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web.App_Code;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.Web.Controllers
{
    [Authorize(Roles = "admin,manager,salesperson")]
    public class AdminController : Controller
    {
        private IUserService userService;
        private IProductService productService;
        private IProductImageService productImageService;
        private ISupplierService supplierService;
        private IActionLogService actionLogService;
        private IAttributeVariationService attributeVariationService;
        private IWebHostEnvironment env;

        public AdminController(IUserService userService, IProductService productService, IProductImageService productImageService, ISupplierService supplierService, IActionLogService actionLogService, IAttributeVariationService attributeVariationService, IWebHostEnvironment env)
        {
            this.userService = userService;
            this.productService = productService;
            this.productImageService = productImageService;
            this.supplierService = supplierService;
            this.actionLogService = actionLogService;
            this.attributeVariationService = attributeVariationService;
            this.env = env;
        }

        public ActionResult Index()
        {
            return View("Dashboard");
        }

        public ActionResult Category()
        {
            return View();
        }

        public ActionResult CustomerAdd()
        {
            return View();
        }

        public ActionResult CustomerList()
        {
            return View();
        }

        public ActionResult ProductList()
        {
            return View();
        }

        public JsonResult GetCustomerList()
        {
            List<UserViewModel> itemList = new List<UserViewModel>();

            var list = this.userService.GetAllCustomers();
            foreach (User user in list)
            {
                UserViewModel item = new UserViewModel();
                item.Id = user.Id;
                item.FirstName = user.FirstName;
                item.LastName = user.LastName;
                item.Username = user.Username;
                item.Password = user.Password;
                item.ShipCountry = user.ShipCountry;
                item.ShipZipCode = user.ShipZipCode;
                item.ShipAddress = user.ShipAddress;
                item.ShipCity = user.ShipCity;
                item.ShipState = user.ShipState;

                itemList.Add(item);
            }

            return Json(itemList);
        }

        public JsonResult GetCustomer(string id)
        {
            UserViewModel item = new UserViewModel();
            var user = this.userService.GetUserById(id);

            if (user != null)
            {
                item.Id = user.Id;
                item.FirstName = user.FirstName;
                item.LastName = user.LastName;
                item.Username = user.Username;
                item.Password = user.Password;
                item.ShipCountry = user.ShipCountry;
                item.ShipZipCode = user.ShipZipCode;
                item.ShipAddress = user.ShipAddress;
                item.ShipCity = user.ShipCity;
                item.ShipState = user.ShipState;
            }

            return Json(item);
        }

        public JsonResult GetLowStockCount()
        {
            int count = this.productService.GetLowStockItemCount();
            return Json(count);
        }

        public JsonResult GetAdminProductList(int pageNo = 1, string searchText = "", int branchId = 0, int categoryId = 0, int itemTypeId = 0, int supplierId = 0, string attribute = "", string lowStock = "")
        {
            string userId = AppUtils.GetLoggedInUserId();
            var imageSrcPrefix = "/ProductImages/Shaped/";
            List<ProductViewModel> productVMList = new List<ProductViewModel>();

            string allChildCategoryIds = String.Empty;
            if (categoryId > 0)
            {
                allChildCategoryIds = AppUtils.GetAllChildIds(categoryId.ToString());
            }

            int pageNumber = pageNo;
            int pageSize = 20;

            int recordFrom = (pageNumber - 1) * pageSize + 1;
            int recordTo = recordFrom + (pageSize - 1);

            // Sort order
            string orderBy = " ActionDate desc ";

            // Select clause
            string selectRecords = String.Format(@"
                                            SELECT * FROM 
                                            (
                                                SELECT ROW_NUMBER() OVER(ORDER BY {0}) AS RowNum, p.* FROM Products p
                                                #WHERE#
                                            ) AS TBL ", orderBy);

            // Select total count
            string selectTotalCount = String.Format(@"SELECT COUNT(*) AS TotalRecords FROM Products p ");

            // Where clause
            string whereQuery = String.Format(@" WHERE IsDeleted = 0 ");

            if (!String.IsNullOrEmpty(searchText))
            {
                whereQuery += String.Format(" and (Title Like '%{0}%' or Barcode = '{0}' or IMEI = '{0}') ", searchText);
            }

            if (branchId > 0)
            {
                whereQuery += String.Format(" and BranchId = {0} ", branchId);
            }

            if (!String.IsNullOrEmpty(allChildCategoryIds))
            {
                whereQuery += " and CategoryId IN (" + allChildCategoryIds + ")";
            }

            if (itemTypeId > 0)
            {
                whereQuery += String.Format(" and ItemTypeId = {0} ", itemTypeId);
            }

            if (supplierId > 0)
            {
                whereQuery += String.Format(" and SupplierId = {0} ", supplierId);
            }

            if (!String.IsNullOrEmpty(attribute))
            {
                if (attribute == "Main")
                {
                    whereQuery += " and IsMainItem = 1 ";
                }
                else if (attribute == "FastMoving")
                {
                    whereQuery += " and IsFastMoving = 1 ";
                }
                else if (attribute == "Internal")
                {
                    whereQuery += " and IsInternal = 1 ";
                }
            }

            if (!String.IsNullOrEmpty(lowStock))
            {
                whereQuery += String.Format(" and Quantity <= LowStockAlert ");
            }

            // Exclude anonymous product
            whereQuery += String.Format(" and Id != '00000000-0000-0000-0000-000000000000' ");

            // Paging clause
            string pagingQuery = String.Format(@" WHERE RowNum BETWEEN {0} AND {1}", recordFrom, recordTo);

            string sqlQuery = selectRecords.Replace("#WHERE#", whereQuery) + pagingQuery;
            string sqlTotalRecords = selectTotalCount + whereQuery;

            // Get search records
            var productList = Utils.ExecuteQuery<ProductViewModel>(sqlQuery).ToList();
            if (productList != null && productList.Count > 0)
            {
                foreach (ProductViewModel product in productList)
                {
                    ProductViewModel productVM = new ProductViewModel();

                    string priceText = Utils.GetCurrencyCode() + string.Format("{0:#,0}", product.RetailPrice);

                    string onlineDiscount = product.Discount != null ? Utils.GetCurrencyCode() + string.Format("{0:#,0}", product.Discount) : Utils.GetCurrencyCode() + "0";

                    string discountText = onlineDiscount;

                    productVM.Id = product.Id;
                    productVM.Title = product.Title;
                    productVM.Barcode = product.Barcode;
                    productVM.ActionDate = product.ActionDate;
                    productVM.ActionDateString = product.ActionDate.ToString();
                    productVM.IsApproved = product.IsApproved;
                    productVM.Status = product.Status;
                    productVM.Quantity = product.Quantity;                    
                    productVM.SupplierName = product.SupplierName;
                    productVM.ItemTypeName = product.ItemTypeName;
                    productVM.PriceText = priceText;
                    productVM.CostPriceText = Utils.GetCurrencyCode() + string.Format("{0:#,0}", product.CostPrice);
                    productVM.DiscountText = discountText;
                    productVM.Discount = product.Discount == null ? 0 : product.Discount;
                    productVM.WeightText = product.Weight != null ? (decimal)product.Weight + " " + product.Unit : "";
                    productVM.LowStockAlert = product.LowStockAlert;
                    productVM.ItemTypeName = product.ItemTypeName;

                    string attributes = String.Empty;
                    if (product.IsFeatured != null && (bool)product.IsFeatured)
                    {
                        attributes += "Show home page";
                    }

                    attributes = !String.IsNullOrEmpty(attributes) ? attributes.TrimEnd(' ').TrimEnd(',') : "";
                    productVM.Attributes = attributes;

                    // Get the supplier name if any
                    if (product.SupplierId != null)
                    {
                        var supplier = this.supplierService.GetSupplier((int)product.SupplierId);
                        if (supplier != null)
                        {
                            productVM.SupplierName = supplier.Name;
                        }
                    }

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

            // Get total records
            int totalPages = 0;
            int totalRecords = 0;

            var item = Utils.ExecuteQuery<TotalRecordsViewModel>(sqlTotalRecords).FirstOrDefault();

            totalPages = (int)Math.Ceiling((double)item.TotalRecords / pageSize);
            totalRecords = item.TotalRecords;

            return Json(new
            {
                recordList = productVMList,
                totalPages = totalPages,
                totalRecords = totalRecords
            });
        }

        public JsonResult GetAttributeVariationList(string productId)
        {
            List<AttributeVariation> attrList = this.attributeVariationService.GetAttributeVariations(productId).ToList();
            List<AttributeVariationViewModel> attrVMList = new List<AttributeVariationViewModel>();

            foreach (var item in attrList)
            {
                attrVMList.Add(new AttributeVariationViewModel { Id = item.Id, ProductId = item.ProductId, Title = item.Title, Price = item.Price, Quantity = item.Quantity });
            }
            
            return Json(attrVMList);
        }

        public JsonResult GetStockList(int branchId, int categoryId = 0)
        {
            string userId = AppUtils.GetLoggedInUserId();
            var imageSrcPrefix = "/ProductImages/Shaped/";
            List<ProductViewModel> productVMList = new List<ProductViewModel>();

            if (!String.IsNullOrEmpty(userId))
            {
                var productList = this.productService.GetAllProducts(branchId);
                foreach (Product product in productList)
                {
                    ProductViewModel productVM = new ProductViewModel();

                    productVM.Id = product.Id;
                    productVM.Title = product.Title;
                    productVM.Barcode = product.Barcode;
                    productVM.Quantity = product.Quantity;
                    productVM.LowStockAlert = product.LowStockAlert;

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

            return Json(productVMList);
        }

        public JsonResult UpdateAttributeVariation(string id, decimal price, int quantity)
        {
            bool isSuccess = true;
            try
            {
                this.attributeVariationService.UpdatePriceQuantity(id, price, quantity);
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex, "Failed to update quantity!");
            }

            return Json(new Result { IsSuccess = isSuccess });
        }

        public JsonResult UpdateStock(string productId, int quantity)
        {
            bool isSuccess = true;
            try
            {
                this.productService.UpdateStockQty(productId, quantity);

                AppCommon.WriteActionLog(actionLogService, "Product", "Update Stock", "Product Id: " + productId + " Stock: " + quantity, "Update", User.Identity.Name);
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex, "Failed to update quantity!");
            }

            return Json(new Result { IsSuccess = isSuccess });
        }

        public JsonResult DeleteProduct(string productId)
        {
            bool isSuccess = true;
            try
            {
                isSuccess = this.productService.DeleteProduct(productId);

                AppCommon.WriteActionLog(actionLogService, "Product", "Delete Product", "Product Id: " + productId, "Delete", User.Identity.Name);

                if (isSuccess)
                {
                    var productImageList = this.productImageService.GetProductImages(productId, false);
                    foreach (ProductImage pi in productImageList)
                    {
                        AppUtils.DeleteProductImage(env, productImageService, pi.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex, "Failed to delete user!");
            }

            return Json(new Result { IsSuccess = isSuccess });
        }

        public JsonResult GetOrderStatus()
        {

            String fromDate = DateTime.Now.Year.ToString() + "-" + DateTime.Now.Month.ToString() + "-" + DateTime.Now.Day.ToString();
            String toDate = DateTime.Now.AddDays(1).Year.ToString() + "-" + DateTime.Now.AddDays(1).Month.ToString() + "-" + DateTime.Now.AddDays(1).Day.ToString();

            string sqlQuery = String.Format(@"SELECT (select count(*) from orders where OrderMode = 'Store' and ActionDate between '{0}' and '{1}') as StoreSell,
                                            (select count(*) from orders where OrderMode = 'Online' and ActionDate between '{0}' and '{1}') as OnlineSell,
                                            (select count(*) from orders where OrderMode = 'PhoneOrder' and ActionDate between '{0}' and '{1}') as PhoneOrderSell,
                                            (select count(*) from orders where OrderStatus = 'Pending' and ActionDate between '{0}' and '{1}') as OrderPending", fromDate, toDate);

            var recordList = Utils.ExecuteQuery<OrderStatusViewModel>(sqlQuery).ToList();
            if (recordList != null && recordList.Count > 0)
            {
                return Json(recordList);
            }

            return Json(null);
        }

        public JsonResult GetTotalItemValues()
        {
            string sqlQuery = String.Format(@"SELECT (select count(*) from products where IsDeleted = 0) as TotalItemPosted,
                                            (select SUM(CostPrice * Quantity) from products where IsDeleted = 0) as TotalItemValue");

            var recordList = Utils.ExecuteQuery<TotalItemValues>(sqlQuery).ToList();
            if (recordList != null && recordList.Count > 0)
            {
                return Json(recordList);
            }

            return Json(null);
        }
    }    
}