using Application.Common;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Caching;

namespace Application.Controllers
{
    public class HomeController : Controller
    {
        private IUserService userService;        
        private ISettingService settingService;
        private IProductService productService;        
        private IProductImageService productImageService;
        private ICategoryService categoryService;

        public HomeController(IUserService userService, IProductService productService, IProductImageService productImageService, ISettingService settingService, ICategoryService categoryService)
        {
            this.userService = userService;            
            this.productService = productService;            
            this.productImageService = productImageService;
            this.categoryService = categoryService;
            this.settingService = settingService;

            ReadSettingValues();
        }

        public ActionResult Index()
        {
            return View();            
        }

        private void ReadSettingValues()
        {
            List<Setting> settingList = new List<Setting>();
            ObjectCache cache = MemoryCache.Default;
            if (!cache.Contains(ConstKey.ckSettings))
            {
                // Get all settings from DB
                settingList = this.settingService.GetSettings().ToList();

                // Store data in the cache
                CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
                cacheItemPolicy.SlidingExpiration = TimeSpan.FromDays(1);
                cache.Add(ConstKey.ckSettings, settingList, cacheItemPolicy);     
            }           
        }        
        
        public JsonResult GetCategoryWithImage()
        {
            List<HomePageCategoriesModel> itemList = new List<HomePageCategoriesModel>();

            var catList = this.categoryService.GetHomepageCategoryList();
            foreach (var item in catList)
            {
                HomePageCategoriesModel model = new HomePageCategoriesModel();
                model.CategoryId = item.Id.ToString();
                model.Title = item.Name;
                model.ImageName = item.ImageName;

                itemList.Add(model);
            }

            var rnd = new Random();
            itemList = itemList.OrderBy(x => rnd.Next()).ToList();

            return Json(itemList);
        }

        private List<HomePageItem> GetFormattedItems(List<HomePageItem> list)
        {
            string imageSrcPrefix = "/ProductImages";

            foreach (var product in list)
            {
                product.TitleSEO = Utils.GenerateSeoTitle(product.Title);

                // Price & Discount
                string priceText = String.Empty;
                string oldPriceText = String.Empty;
                decimal newPrice = 0;
                Utils.GetPrice(product.RetailPrice, product.Discount, out newPrice, out priceText, out oldPriceText);
                product.RetailPrice = newPrice;
                product.PriceText = priceText;
                product.PriceTextOld = oldPriceText;

                product.PrimaryImageName = imageSrcPrefix + "/Large/" + product.PrimaryImageName;

                // Get price based on attribute variations (color & size) if any
                string attributePrice = AppUtils.GetPriceText(product.Id);
                if (!String.IsNullOrEmpty(attributePrice))
                {
                    product.PriceText = attributePrice;
                    product.PriceTextOld = String.Empty;
                }
            }

            return list;
        }
        
        public JsonResult GetHomepageCategoryItems(bool isLoadProducts = true)
        {
            List<HomePageCategoriesModel> itemList = new List<HomePageCategoriesModel>();

            var catList = this.categoryService.GetHomepageCategoryList();
            foreach (var item in catList)
            {
                HomePageCategoriesModel model = new HomePageCategoriesModel();
                model.CategoryId = item.Id.ToString();
                model.Title = item.Name;
                model.ImageName = item.ImageName;
                
                if (isLoadProducts)
                {
                    string catIds = AppUtils.GetAllChildIds(item.Id.ToString());
                    List<HomePageItem> list = productService.GetCategoryItems(catIds);
                    model.ProductList = GetFormattedItems(list);
                }

                itemList.Add(model);
            }

            return Json(itemList);
        }

        public JsonResult GetHomePage_FeaturedItems()
        {
            List<HomePageItem> list = productService.GetFeaturedItems();
            
            // Get formatted items
            list = GetFormattedItems(list);

            // Randomize the item list
            var rnd = new Random();
            list = list.OrderBy(x => rnd.Next()).ToList();

            return Json(list);
        }

        public JsonResult GetHomePage_PopularItems()
        {
            List<HomePageItem> list = productService.GetPopularItems();

            // Get formatted items
            list = GetFormattedItems(list);

            // Randomize the item list
            var rnd = new Random();
            list = list.OrderBy(x => rnd.Next()).ToList();

            return Json(list);
        }

        public JsonResult GetHomePage_NewArrivals()
        {
            List<HomePageItem> list = productService.GetNewArrivalsItems();

            // Get formatted items
            list = GetFormattedItems(list);

            // Randomize the item list
            var rnd = new Random();
            list = list.OrderBy(x => rnd.Next()).ToList();

            return Json(list);
        }         
    }
}