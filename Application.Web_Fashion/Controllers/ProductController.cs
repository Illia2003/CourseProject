using Application.Common;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    public class ProductController : Controller
    {
        private IUserService userService;
        private IProductService productService;
        private IProductImageService productImageService;                
        public ProductController(IUserService userService, IProductImageService productImageService, IProductService productService)
        {
            this.userService = userService;
            this.productService = productService;
            this.productImageService = productImageService;
        }

        public ActionResult Search()     
        {           
            return View();
        }

        public ActionResult Details()
        {
            return View();
        }

        public JsonResult GetProduct(string id)
        {
            ProductViewModel pvm = new ProductViewModel();

            var product = this.productService.GetProduct(id);
            FillProduct(pvm, product);

            return Json(pvm);
        }

        public JsonResult GetProductByBarcode(string barcode)
        {
            ProductViewModel pvm = new ProductViewModel();

            var product = this.productService.GetProductByBarcode(barcode);
            FillProduct(pvm, product);
            
            return Json(pvm);
        }

        public void FillProduct(ProductViewModel pvm, Product product)
        {
            var imageSrcPrefix = "/ProductImages";
            if (product != null)
            {
                pvm.Id = product.Id;                
                pvm.Title = product.Title;
                pvm.Barcode = product.Barcode;
                pvm.BranchId = product.BranchId;
                pvm.SupplierId = product.SupplierId;
                pvm.TitleSEO = Utils.GenerateSeoTitle(product.Id, product.Title);
                pvm.Description = product.Description;
                pvm.CostPrice = product.CostPrice;
                pvm.RetailPrice = product.RetailPrice;
                pvm.Discount = product.Discount == null ? 0 : product.Discount;
                pvm.Weight = product.Weight;
                pvm.Unit = product.Unit;
                pvm.Quantity = product.Quantity;
                pvm.ItemTypeId = product.ItemTypeId;
                pvm.LowStockAlert = product.LowStockAlert;
                pvm.IsFeatured = product.IsFeatured != null ? (bool)product.IsFeatured : false;
                pvm.WeightText = product.Weight != null ? (Convert.ToString((double)product.Weight) + " " + product.Unit) : "";
                pvm.PostingTime = "Posted: " + String.Format("{0:d MMMM yyyy hh:mm tt}", product.ActionDate);

                // Attribute Variations
                pvm.AttributeVariations = new List<AttributeVariation>();
                int count = 1;
                foreach (var item in product.AttributeVariations)
                {
                    pvm.AttributeVariations.Add(new AttributeVariation { Id = item.Id, Title = item.Title, Discount = item.Discount, Price = item.Price, Quantity = item.Quantity, ProductId = item.ProductId });

                    if (count == 1)
                    {
                        string[] data = item.Title.Split('-');
                        if (data.Length == 2)
                        {
                            pvm.DefaultColor = data[0].Trim();
                            pvm.DefaultSize = data[1].Trim();
                            pvm.RetailPrice = item.Price;
                        }
                    }

                    count++;
                }

                // Price & Discount
                string priceText = String.Empty;
                string oldPriceText = String.Empty;
                decimal newPrice = 0;
                Utils.GetPrice(pvm.RetailPrice, product.Discount, out newPrice, out priceText, out oldPriceText);
                pvm.RetailPrice = newPrice;
                pvm.PriceText = priceText;
                pvm.PriceTextOld = oldPriceText;

                // Product images
                pvm.ImageList = new List<ProductImageViewModel>();
                var imageList = this.productImageService.GetProductImages(product.Id);
                if (imageList != null)
                {
                    if (imageList.Count() > 0)
                    {
                        foreach (ProductImage pi in imageList)
                        {
                            ProductImageViewModel pivm = new ProductImageViewModel();
                            pivm.ImageName = imageSrcPrefix + "/Shaped/" + pi.ImageName;
                            pivm.ThumbImageName = imageSrcPrefix + "/Shaped/" + pi.ImageName;
                            pivm.MaxViewImageName = imageSrcPrefix + "/Shaped/" + pi.ImageName;
                            pivm.Id = pi.Id;
                            pivm.ProductId = pi.ProductId;
                            pivm.DisplayOrder = pi.DisplayOrder == null ? 0 : (int)pi.DisplayOrder;
                            pivm.IsPrimaryImage = pi.IsPrimaryImage;
                            pivm.IsApproved = pi.IsApproved;
                            pvm.ImageList.Add(pivm);
                        }
                    }
                    else
                    {
                        ProductImageViewModel pivm = new ProductImageViewModel();
                        pivm.ImageName = imageSrcPrefix + "/Shaped/no-image.jpg";
                        pvm.ImageList.Add(pivm);
                    }
                }

                // Product category
                pvm.Category = new CategoryViewModel();
                pvm.Category.Id = product.CategoryId;

                // Breadcrumb
                List<BreadCrumbViewModel> bcList = new List<BreadCrumbViewModel>();
                BreadCrumbViewModel bc = new BreadCrumbViewModel();
                if (product.Category != null)
                {
                    bc = new BreadCrumbViewModel();
                    bc.Id = product.Category.Id.ToString();
                    bc.Name = product.Category.Name;
                    bcList.Add(bc);

                    if (product.Category.Parent != null)
                    {
                        bc = new BreadCrumbViewModel();
                        bc.Id = product.Category.Parent.Id.ToString();
                        bc.Name = product.Category.Parent.Name;
                        bcList.Add(bc);

                        if (product.Category.Parent.Parent != null)
                        {
                            bc = new BreadCrumbViewModel();
                            bc.Id = product.Category.Parent.Parent.Id.ToString();
                            bc.Name = product.Category.Parent.Parent.Name;
                            bcList.Add(bc);

                            if (product.Category.Parent.Parent.Parent != null)
                            {
                                bc = new BreadCrumbViewModel();
                                bc.Id = product.Category.Parent.Parent.Parent.Id.ToString();
                                bc.Name = product.Category.Parent.Parent.Parent.Name;
                                bcList.Add(bc);
                            }
                        }
                    }
                }

                bc = new BreadCrumbViewModel();
                bc.Id = "";
                bc.Name = product.Title.Substring(0, product.Title.Length <= 60 ? product.Title.Length : 60).Trim();
                bcList.Add(bc);

                pvm.BreadCrumbList = bcList;

                pvm.Seller = new UserViewModel();
                pvm.Seller.Username = product.User.Username;
                pvm.Seller.Id = product.User.Id;
                pvm.Seller.CreatDate = product.User.CreateDate;
                pvm.Seller.MemberSince = Utils.GetDateDifference(DateTime.Now, product.User.CreateDate);

                // Update view count
                this.productService.UpdateViewCount(product.Id);
            }
        }

        public JsonResult GetRelatedProducts(int categoryId, string excludeProductId)
        {
            var imageSrcPrefix = "/ProductImages/Shaped/";
            List<ProductViewModel> rpVMList = new List<ProductViewModel>();
            List<Product> recordList = this.productService.GetRelatedProducts(13, categoryId).ToList();

            if (recordList != null && recordList.Count > 0)
            {
                foreach (Product p in recordList)
                {
                    ProductViewModel rpVM = new ProductViewModel();
                    if (p.Id == excludeProductId)
                    {
                        continue;
                    }

                    rpVM.Id = p.Id;
                    rpVM.Title = p.Title;
                    
                    // Price & Discount
                    string priceText = String.Empty;
                    string oldPriceText = String.Empty;
                    decimal newPrice = 0;
                    Utils.GetPrice(p.RetailPrice, p.Discount, out newPrice, out priceText, out oldPriceText);
                    rpVM.RetailPrice = newPrice;
                    rpVM.PriceText = priceText;
                    rpVM.PriceTextOld = oldPriceText;
                    
                    // Get user images
                    List<ProductImageViewModel> imageVMList = new List<ProductImageViewModel>();
                    var imageList = this.productImageService.GetProductImages(p.Id, true);
                    foreach (ProductImage image in imageList)
                    {
                        if (image.IsPrimaryImage)
                        {
                            rpVM.PrimaryImageName = imageSrcPrefix + image.ImageName;
                            break;
                        }
                    }

                    if (String.IsNullOrEmpty(rpVM.PrimaryImageName))
                    {
                        rpVM.PrimaryImageName = imageSrcPrefix + "no-image.jpg";
                    }

                    rpVMList.Add(rpVM);                    
                }

                if (rpVMList.Count() == 13)
                {
                    rpVMList.Remove(rpVMList.Last());
                }
            }

            return Json(rpVMList);
        }

        public string GetAllChildIds(string id, bool isCategory)
        {
            string sqlQuery = String.Empty;
            string allChildIds = id;

            if (isCategory)
            {
                sqlQuery = String.Format(@"
                                            ;WITH r as (
                                             SELECT ID
                                             FROM Category
                                             WHERE ParentID = {0}
                                             UNION ALL
                                             SELECT d.ID 
                                             FROM Category d
                                                INNER JOIN r 
                                                   ON d.ParentID = r.ID
                                        )
                                        SELECT ID FROM r ", id);
            }

            // Get search records
            var recordList = Utils.ExecuteQuery<ChildIds>(sqlQuery).ToList();
            if (recordList != null && recordList.Count > 0)
            {
                foreach (var record in recordList)
                {
                    allChildIds += "," + record.Id;
                }
            }

            return allChildIds;
        }

        [HttpPost]
        public JsonResult SearchResult([FromBody] SearchModel searchModel)
        {
            var imageSrcPrefix = "/ProductImages/Shaped/";

            if (!String.IsNullOrEmpty(searchModel.CategoryId))
            {
                string[] catIds = searchModel.CategoryId.Split(',');
                if (catIds.Count() == 1)
                {
                    searchModel.CategoryId = GetAllChildIds(searchModel.CategoryId, true);
                }
            }

            string loggedInUserId = (AppUtils.GetLoggedInUser()) != null ? AppUtils.GetLoggedInUser().Id : String.Empty;
            int pageNumber = searchModel.PageNo;
            int pageSize = 28;

            int recordFrom = (pageNumber - 1) * pageSize + 1;
            int recordTo = recordFrom + (pageSize - 1);

            // Sort order
            string orderBy = " p.ActionDate DESC";
            if (!String.IsNullOrEmpty(searchModel.SortOrder))
            {
                switch (searchModel.SortOrder)
                {
                    case "DatePosted":
                        orderBy = " p.ActionDate DESC";
                        break;
                    case "PriceLow":
                        orderBy = " p.Price ASC";
                        break;
                    case "PriceHigh":
                        orderBy = " p.Price DESC";
                        break;
                    default:
                        orderBy = " p.ActionDate DESC";
                        break;
                }
            }

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
            string whereQuery = String.Format(@" WHERE IsApproved = 1 AND IsDeleted = 0 ");

            if (!String.IsNullOrEmpty(searchModel.OnlyDiscount))
            {
                whereQuery += " AND OnlineDiscount > 0 ";
            }

            if (!String.IsNullOrEmpty(searchModel.CategoryId))
            {
                whereQuery += " AND CategoryId IN (" + searchModel.CategoryId.ToString() + ")";
            }

            if (!String.IsNullOrEmpty(searchModel.LocationId))
            {
                whereQuery += " AND LocationId IN (" + searchModel.LocationId.ToString() + ")";
            }

            // Price
            if (searchModel.MinPrice > 0)
            {
                whereQuery += " AND Price >= " + searchModel.MinPrice.ToString() + "";
            }
            if (searchModel.MaxPrice > 0)
            {
                whereQuery += " AND Price <= " + searchModel.MaxPrice.ToString() + "";
            }

            // Free text search (adding OR clause)
            if (!String.IsNullOrEmpty(searchModel.FreeText))
            {
                string freeTextWhereClause = String.Empty;
                string[] searchTextList = searchModel.FreeText.Split();
                foreach (string searchText in searchTextList)
                {
                    if (!String.IsNullOrEmpty(freeTextWhereClause))
                    {
                        freeTextWhereClause += " OR ";
                    }

                    freeTextWhereClause += " Title LIKE '%" + searchText + "%' OR Description LIKE '%" + searchText + "%' ";                    
                }

                if (!String.IsNullOrEmpty(freeTextWhereClause))
                {
                    freeTextWhereClause = " AND (" + freeTextWhereClause + ")";
                    whereQuery += freeTextWhereClause;
                }
            }

            // Color and Size attribute where clause
            string colorSizeAttrWhereClause = String.Empty;
            string colorAttrWhereClause = String.Empty;
            string sizeAttrWhereClause = String.Empty;

            if (!String.IsNullOrEmpty(searchModel.ColorAttr))
            {

                string[] colorValues = searchModel.ColorAttr.TrimEnd(',').Split(',');
                int colorCount = 0;
                foreach (string item in colorValues)
                {
                    if (colorCount > 0)
                    {
                        colorAttrWhereClause += " OR ";
                    }

                    colorAttrWhereClause += "Title LIKE '%" + item + "%'";
                    colorCount++;
                }

                colorAttrWhereClause = " (" + colorAttrWhereClause + ") ";
            }

            if (!String.IsNullOrEmpty(searchModel.SizeAttr))
            {
                string[] sizeValues = searchModel.SizeAttr.TrimEnd(',').Split(',');
                int sizeCount = 0;
                foreach (string item in sizeValues)
                {
                    if (sizeCount > 0)
                    {
                        sizeAttrWhereClause += " OR ";
                    }

                    sizeAttrWhereClause += "Title LIKE '%" + item + "%'";
                    sizeCount++;
                }

                sizeAttrWhereClause = " (" + sizeAttrWhereClause + ") ";
            }

            if (!String.IsNullOrEmpty(colorAttrWhereClause))
            {
                colorSizeAttrWhereClause += colorAttrWhereClause;
            }

            if (!String.IsNullOrEmpty(sizeAttrWhereClause))
            {
                if (String.IsNullOrEmpty(colorSizeAttrWhereClause))
                {
                    colorSizeAttrWhereClause += sizeAttrWhereClause;
                }
                else
                {
                    colorSizeAttrWhereClause += " AND " + sizeAttrWhereClause;
                }
            }

            if (!String.IsNullOrEmpty(colorSizeAttrWhereClause))
            {
                colorSizeAttrWhereClause = " AND Id IN (select ProductId from AttributeVariations where" + colorSizeAttrWhereClause + ")";
            }

            whereQuery += colorSizeAttrWhereClause;

            // Paging clause
            string pagingQuery = String.Format(@" WHERE RowNum BETWEEN {0} AND {1}", recordFrom, recordTo);

            string sqlQuery = selectRecords.Replace("#WHERE#", whereQuery) + pagingQuery;
            string sqlTotalRecords = selectTotalCount + whereQuery;

            // Get search records
            var recordList = Utils.ExecuteQuery<ProductViewModel>(sqlQuery).ToList();
            if (recordList != null && recordList.Count > 0)
            {
                var newRecordList = new List<ProductViewModel>();
                foreach (ProductViewModel p in recordList)
                {
                    p.TitleSEO = Utils.GenerateSeoTitle(p.Title);

                    // Product Price
                    if (p.RetailPrice != null)
                    {
                        // Price & Discount
                        string priceText = String.Empty;
                        string oldPriceText = String.Empty;
                        decimal newPrice = 0;
                        Utils.GetPrice(p.RetailPrice, p.Discount, out newPrice, out priceText, out oldPriceText);
                        p.RetailPrice = newPrice;
                        p.PriceText = priceText;
                        p.PriceTextOld = oldPriceText;
                    }

                    // Get price based on attribute variations (color & size) if any
                    string attributePrice = AppUtils.GetPriceText(p.Id);
                    if (!String.IsNullOrEmpty(attributePrice))
                    {
                        p.PriceText = attributePrice;
                        p.PriceTextOld = String.Empty;
                    }

                    // Get user images
                    List<ProductImageViewModel> imageVMList = new List<ProductImageViewModel>();
                    var imageList = this.productImageService.GetProductImages(p.Id, true);
                    foreach (ProductImage image in imageList)
                    {
                        ProductImageViewModel imageVM = new ProductImageViewModel();
                        imageVM.ProductId = p.Id;
                        imageVM.ImageName = image.ImageName;
                        imageVM.DisplayOrder = image.DisplayOrder != null ? (int)image.DisplayOrder : 0;
                        imageVM.IsApproved = image.IsApproved;
                        imageVM.IsPrimaryImage = image.IsPrimaryImage;
                        if (image.IsPrimaryImage)
                        {
                            p.PrimaryImageName = imageSrcPrefix + image.ImageName;
                        }

                        imageVMList.Add(imageVM);
                    }

                    if (String.IsNullOrEmpty(p.PrimaryImageName))
                    {
                        p.PrimaryImageName = imageSrcPrefix + "no-image.jpg";
                    }

                    p.ImageList = imageVMList;

                    // Post time
                    string postingTime = "Posted: ";
                    TimeSpan span = (DateTime.Now - p.ActionDate);
                    int min = span.Minutes;
                    int hour = span.Hours;
                    int day = span.Days;

                    if (day > 0)
                    {
                        postingTime += day > 1 ? day.ToString() + " days" : day.ToString() + " day";
                    }
                    else if (hour > 0)
                    {
                        postingTime += hour > 1 ? hour.ToString() + " hours" : hour.ToString() + " hour";
                    }
                    else if (min > 0)
                    {
                        postingTime += min > 1 ? min.ToString() + " minutes" : min.ToString() + " minute";
                    }
                    else
                    {
                        postingTime += " few seconds";
                    }
                    postingTime += " ago";
                    p.PostingTime = postingTime;
                }
            }

            // Get total records
            int totalPages = 0;
            int totalRecords = 0;
            if (searchModel.IsGetTotalRecord)
            {
                var item = Utils.ExecuteQuery<TotalRecordsViewModel>(sqlTotalRecords).FirstOrDefault();

                totalPages = (int)Math.Ceiling((double)item.TotalRecords / pageSize);
                totalRecords = item.TotalRecords;
            }

            return Json(new
            {
                recordList = recordList,
                totalPages = totalPages,
                totalRecords = totalRecords
            });
        }

        public JsonResult GetProductTitles(string titlePart)
        {
            string sqlQuery = String.Format(@"select Id, Title from Products where Title like '%{0}%'", titlePart);
            try
            {
                var recordList = Utils.ExecuteQuery<ProductViewModel>(sqlQuery).ToList();
                if (recordList != null && recordList.Count > 0)
                {
                    return Json(recordList);
                }
            }
            catch (Exception exp)
            {

            }

            return Json(new List<ProductViewModel>());
        }
    }    
}