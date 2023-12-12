using Application.Common;
using Application.Logging;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web.App_Code;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Transactions;

namespace Application.Web.Controllers
{
    [Authorize]
    public class ProductEntryController : Controller
    {
        private IProductService productService;
        private IProductImageService productImageService;
        private IActionLogService actionLogService;
        private IWebHostEnvironment env;
        public ProductEntryController(IProductService productService, IProductImageService productImageService, IActionLogService actionLogService, IWebHostEnvironment env)
        {
            this.productService = productService;
            this.productImageService = productImageService;
            this.actionLogService = actionLogService;
            this.env = env;
        }
        
        public ActionResult Post()
        {
            return View();
        }

        public ActionResult EditPost()
        {
            return View();
        }

        public ActionResult StockUpdate()
        {
            return View();
        }

        public ActionResult AttributeVariation()
        {
            return View();
        }

        public ActionResult EditCategory()
        {
            return View();
        }

        public ActionResult PostProductMessage()
        {
            return View();
        }

        [HttpGet]
        public JsonResult IsBarcodeExists(string barcode)
        {
            bool isExists = productService.IsBarcodeExists(barcode);

            return Json(new
            {
                isExists = isExists,
            });
        }

        [HttpGet]
        public JsonResult GetGeneratedBarcode()
        {
            int code = GetProductCode();
            string productCode = code.ToString().PadLeft(5, '0');
            string prefix = "10001";
            string barcode = "0" + prefix + productCode + "9";

            return Json(new
            {
                barcode
            });
        }

        [HttpPost]
        public ActionResult PostProduct()
        {
            string productJson = String.Empty;

            var formDictionary = new Dictionary<string, StringValues>();
            var form = Request.Form;

            foreach (var key in form.Keys)
            {
                if (key == "product")
                {
                    form.TryGetValue(key, out StringValues formValues);
                    productJson = formValues.ToString();
                }
            }

            if (String.IsNullOrEmpty(productJson))
            {
                return Json(new
                {
                    isSuccess = false,
                    message = "Product information not found!"
                });
            }

            Product product = JsonConvert.DeserializeObject<Product>(productJson);

            if (ModelState.IsValid)
            {
                bool isSuccess = true;
                string productId = Guid.NewGuid().ToString();
                bool isAdmin = User.IsInRole("admin") ? true : false;

                string copyImages = String.Empty;
                if (!String.IsNullOrEmpty(product.Status))
                {
                    copyImages = product.Status;
                }

                // Barcode can't be duplicate
                if (!String.IsNullOrEmpty(product.Barcode))
                {
                    bool isBarcodeExists = this.productService.IsBarcodeExists(product.BranchId, product.Barcode);
                    if (isBarcodeExists)
                    {
                        return Json(new
                        {
                            isSuccess = false,
                            message = "Product barcode is already exists!"
                        });
                    }
                }

                using (TransactionScope tran = new TransactionScope())
                {
                    try
                    {
                        int productCode = GetProductCode();
                        product.Id = productId;
                        product.UserId = AppUtils.GetLoggedInUser().Id;
                        product.LowStockAlert = 5;
                        product.IsApproved = true;
                        product.Status = EAdStatus.Running.ToString();                        
                        product.CostPrice = product.CostPrice == null ? 0 : product.CostPrice;
                        product.RetailPrice = product.RetailPrice == null ? 0 : product.RetailPrice;
                        product.ActionDate = DateTime.Now;

                        // Post user
                        this.productService.CreateProduct(product);

                        if (isSuccess)
                        {
                            // Save product images
                            isSuccess = AppUtils.SaveProductImage(env, productImageService, Request, productId, true);

                            // Now complete the transaction
                            tran.Complete();
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
                });
            }

            return View();
        }

        [HttpPost]
        public ActionResult UpdateProduct()
        {
            bool isSuccess = true;
            string productJson = String.Empty;
            var form = Request.Form;

            foreach (var key in form.Keys)
            {
                if (key == "product")
                {
                    form.TryGetValue(key, out StringValues formValues);
                    productJson = formValues.ToString();
                    break;
                }
            }

            if (String.IsNullOrEmpty(productJson))
            {
                return Json(new
                {
                    isSuccess = false,
                    message = "Product information not found!"
                });
            }

            Product product = JsonConvert.DeserializeObject<Product>(productJson);

            // Barcode can't be duplicate
            if (!String.IsNullOrEmpty(product.Barcode))
            {
                bool isBarcodeExists = this.productService.IsBarcodeExists(product.Barcode, product.Id);
                if (isBarcodeExists)
                {
                    return Json(new
                    {
                        isSuccess = false,
                        message = "Product barcode is already exists!"
                    });
                }
            }

            try
            {
                Product prodToUpdate = this.productService.GetProduct(product.Id);
                if (prodToUpdate != null)
                {
                    prodToUpdate.Title = product.Title;
                    prodToUpdate.Barcode = product.Barcode;
                    prodToUpdate.BranchId = product.BranchId;
                    prodToUpdate.SupplierId = product.SupplierId;
                    prodToUpdate.ItemTypeId = product.ItemTypeId;
                    prodToUpdate.Description = product.Description;
                    prodToUpdate.CostPrice = product.CostPrice == null ? 0 : product.CostPrice;                    
                    prodToUpdate.RetailPrice = product.RetailPrice == null ? 0 : product.RetailPrice;
                    prodToUpdate.Weight = product.Weight;
                    prodToUpdate.Unit = product.Unit;
                    prodToUpdate.Quantity = product.Quantity;
                    prodToUpdate.LowStockAlert = product.LowStockAlert;
                    prodToUpdate.IsFeatured = product.IsFeatured != null ? (bool)product.IsFeatured : false;
                    prodToUpdate.ActionDate = DateTime.Now;

                    this.productService.UpdateProduct(prodToUpdate);
                    AppCommon.WriteActionLog(actionLogService, "Product", "Product Update", "Product Name: " + prodToUpdate.Title, "Update", User.Identity.Name);
                }                
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex);
            }

            return Json(new
            {
                isSuccess = isSuccess,
            });
        }

        [Authorize]
        [HttpPost]
        public ActionResult UpdateCategory(string productId, int categoryId)
        {
            bool isSuccess = true;
            try
            {
                Product prodToUpdate = this.productService.GetProduct(productId);
                if (prodToUpdate != null)
                {
                    prodToUpdate.CategoryId = categoryId;
                }

                this.productService.UpdateProduct(prodToUpdate);

                AppCommon.WriteActionLog(actionLogService, "Product", "Product Category Update", "Product Name: " + prodToUpdate.Title, "Update", User.Identity.Name);
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex);
            }

            return Json(new
            {
                isSuccess = isSuccess,
            });
        }

        public int GetProductCode()
        {
            int code = 0;
            try
            {
                string query = "SELECT IDENT_CURRENT('Products') as Code;";

                var productCode = Utils.ExecuteQuery<ProductCode>(query).FirstOrDefault();
                if (productCode != null)
                {
                    code = Decimal.ToInt32(productCode.Code) + 1;
                }
            }
            catch { }

            return code;
        }
    }
}