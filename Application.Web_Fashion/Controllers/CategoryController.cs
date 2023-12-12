using Application.Common;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Caching;

namespace Application.Controllers
{
    public class CategoryController : Controller
    {
        private ICategoryService categoryService;
        private IProductService productService;
        private IWebHostEnvironment env;

        public CategoryController(ICategoryService categoryService, IProductService productService, IWebHostEnvironment env)
        {
            this.categoryService = categoryService;
            this.productService = productService;
            this.env = env;
        }

        public ActionResult ManageCategory()     
        {           
            return View();
        }

        public ActionResult CategoryPhoto()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveCategoryPhoto(string catId)
        {
            bool isSuccess = false;
            
            if (Request.Form.Files == null || Request.Form.Files[0] == null)
                return Json(new
                {
                    isSuccess = false,
                    message = "Please choose a category image!"
                });

            foreach (var file in Request.Form.Files)
            {
                var fileName = catId + ".jpg";
                var imagePath = Path.Combine(env.WebRootPath, "Photos/Categories/" + fileName);

                // Save photo
                using (Stream fileStream = new FileStream(imagePath, FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }

                if (!String.IsNullOrEmpty(catId))
                {
                    Category category = categoryService.GetCategory(int.Parse(catId));
                    if (category != null)
                    {
                        category.ImageName = fileName;
                        categoryService.UpdateCategory(category);
                    }
                }
                
                isSuccess = true;
            }

            return Json(new
            {
                isSuccess
            });
        }

        public JsonResult GetCategoryPhoto(string catId)
        {
            string imageName = String.Empty;

            if (!String.IsNullOrEmpty(catId))
            {
                var category = categoryService.GetCategory(int.Parse(catId));
                if (category != null)
                {
                    imageName = category.ImageName;
                }
            }

            return Json(new
            {
                imageName = imageName                
            });
        }

        public JsonResult DeleteCategoryPhoto(string catId)
        {
            bool isSuccess = true;
            try
            {
                var category = categoryService.GetCategory(int.Parse(catId));

                if (category != null)
                {
                    // Delete category image
                    string file = Path.Combine(env.WebRootPath, "Photos/Categories/" + category.ImageName);
                    if (Directory.Exists(Path.GetDirectoryName(file)))
                    {
                        System.IO.File.Delete(file);
                    }

                    // Update category table
                    category.ImageName = null;
                    categoryService.UpdateCategory(category);
                }
            }
            catch
            {
                isSuccess = false;
            }

            return Json(new
            {
                isSuccess = isSuccess
            });
        }

        [HttpPost]
        public JsonResult SaveCategoryIcon(string catId)
        {
            bool isSuccess = false;

            if (Request.Form.Files == null || Request.Form.Files[0] == null)
                return Json(new
                {
                    isSuccess = false,
                    message = "Please choose a category icon!"
                });

            foreach (var file in Request.Form.Files)
            {
                var fileName = catId + ".jpg";
                var imagePath = Path.Combine(env.WebRootPath, "Photos/Categories/Icons/" + fileName);
                
                // Save photo
                using (Stream fileStream = new FileStream(imagePath, FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }

                if (!String.IsNullOrEmpty(catId))
                {
                    Category category = categoryService.GetCategory(int.Parse(catId));
                    if (category != null)
                    {
                        category.IconName = fileName;
                        categoryService.UpdateCategory(category);
                    }
                }

                isSuccess = true;
            }

            return Json(new
            {
                isSuccess
            });
        }

        public JsonResult GetCategoryIcon(string catId)
        {
            string iconName = String.Empty;

            if (!String.IsNullOrEmpty(catId))
            {
                var category = categoryService.GetCategory(int.Parse(catId));
                if (category != null)
                {
                    iconName = category.IconName;
                }
            }

            return Json(new
            {
                iconName = iconName
            });
        }

        public JsonResult DeleteCategoryIcon(string catId)
        {
            bool isSuccess = true;
            try
            {
                var category = categoryService.GetCategory(int.Parse(catId));

                if (category != null)
                {
                    // Delete category image
                    string file = Path.Combine(env.WebRootPath, "Photos/Categories/Icons/" + category.IconName);
                    if (Directory.Exists(Path.GetDirectoryName(file)))
                    {
                        System.IO.File.Delete(file);
                    }

                    // Update category table
                    category.IconName = null;
                    categoryService.UpdateCategory(category);
                }
            }
            catch
            {
                isSuccess = false;
            }

            return Json(new
            {
                isSuccess = isSuccess
            });
        }
        
        public JsonResult GetParentCategoryList()
        {
            List<CategoryViewModel> list = new List<CategoryViewModel>();

            ObjectCache cache = MemoryCache.Default;
            if (cache.Contains(ConstKey.ckCategories))
            {
                list = (List<CategoryViewModel>)cache.Get(ConstKey.ckCategories);
            }
            else
            {
                List<Category> parentLocList = this.categoryService.GetCategoryList(true).ToList();
                foreach (Category cat in parentLocList)
                {
                    CategoryViewModel lvm = new CategoryViewModel();
                    lvm.Id = cat.Id;
                    lvm.Name = cat.Name;
                    lvm.ParentId = cat.ParentId;
                    lvm.DisplayOrder = cat.DisplayOrder;
                    lvm.IconName = String.IsNullOrEmpty(cat.IconName) ? "circle.png" : cat.IconName;

                    list.Add(lvm);
                }

                // Store data in the cache
                CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
                cacheItemPolicy.SlidingExpiration = TimeSpan.FromDays(1);
                cache.Add(ConstKey.ckCategories, list, cacheItemPolicy);
            }

            return Json(list);
        }

        public JsonResult GetCategoryTree()
        {
            List<CategoryViewModel> finalLocList = new List<CategoryViewModel>();
            List<Category> catList = this.categoryService.GetCategoryList(false).ToList();

            List<Category> parentList = new List<Category>();
            foreach (Category cat in catList)
            {
                if (cat.ParentId == null)
                {
                    parentList.Add(cat);
                }
            }

            foreach (Category cat in parentList)
            {
                GetAllChildLocs(cat.Id, finalLocList, catList);
            }

            return Json(finalLocList);
        }

        public JsonResult GetCategoryName(string productId)
        {
            int categoryId = 0;
            string categoryName = String.Empty;

            var product = this.productService.GetProduct(productId);

            if (product != null)
            {
                categoryId = product.CategoryId;
            }

            string query = String.Format(@"WITH RCTE AS
                                (
                                SELECT Id, ParentId, 1 AS Lvl, cat.Name
                                FROM Category cat WHERE cat.[Id] = {0}
    
                                UNION ALL
    
                                SELECT nextDepth.Id  as ItemId, nextDepth.ParentId as ItemParentId, Lvl+1 AS Lvl, nextDepth.[Name]
                                FROM Category nextDepth
                                INNER JOIN RCTE recursive ON nextDepth.Id = recursive.ParentId
                                )
                                    
                            SELECT Id, ParentId, Lvl as [Level], Name
                            FROM RCTE as hierarchie order by lvl desc ", categoryId);

            var recordList = Utils.ExecuteQuery<CategoryTree>(query).ToList();
            if (recordList != null && recordList.Count > 0)
            {
                foreach (var record in recordList)
                {
                    categoryName += record.Name + " / ";
                }
            }

            if (!String.IsNullOrEmpty(categoryName))
            {
                categoryName = categoryName.TrimEnd(' ').TrimEnd('/').TrimEnd(' ');
            }

            return Json(categoryName);
        }

        private void GetAllChildLocs(int id, List<CategoryViewModel> list, List<Category> originalLocList)
        {
            Category cat = FindCategory(id, originalLocList);

            if (cat != null)
            {
                CategoryViewModel lvm = new CategoryViewModel();
                lvm.Id = cat.Id;
                lvm.Name = cat.Name;
                lvm.ParentId = cat.ParentId;
                lvm.DisplayOrder = cat.DisplayOrder;
                
                list.Add(lvm);

                lvm.ChildCategories = new List<CategoryViewModel>();
                lvm.HasChild = (cat.InverseParent != null && cat.InverseParent.Count() > 0) ? true : false;

                // Sort by 'DisplayOrder' and then 'Name'
                if (cat.InverseParent != null && cat.InverseParent.Count() > 0)
                {
                    cat.InverseParent = cat.InverseParent.OrderBy(r => r.DisplayOrder).ThenBy(r => r.Name).ToList();
                }    

                foreach (Category c in cat.InverseParent)
                {
                    GetAllChildLocs(c.Id, lvm.ChildCategories, originalLocList);
                }
            }
        }

        private Category FindCategory(int id, List<Category> originalLocList)
        {
            Category catReturn = null;

            foreach (Category cat in originalLocList)
            {
                if (cat.Id == id)
                {
                    catReturn = cat;
                    break;
                }
            }

            return catReturn;
        }

        public JsonResult GetCategory(int id)
        {
            CategoryViewModel cvm = new CategoryViewModel();
            var cat = this.categoryService.GetCategory(id);
            if (cat != null)
            {
                cvm.Id = cat.Id;
                cvm.Name = cat.Name;
                cvm.ParentId = cat.ParentId;
                cvm.IsPublished = cat.IsPublished;
                cvm.DisplayOrder = cat.DisplayOrder;
                cvm.Description = cat.Description;
            }

            return Json(cvm);
        }
        public JsonResult GetCategoryList()
        {
            var itemList = this.categoryService.GetCategoryList(false, false);

            List<CategoryViewModel> list = new List<CategoryViewModel>();
            foreach (var cat in itemList)
            {
                CategoryViewModel cvm = new CategoryViewModel();
                cvm.Id = cat.Id;
                cvm.Name = cat.Name;
                cvm.ParentId = cat.ParentId;
                cvm.ParentName = cat.Parent != null ? cat.Parent.Name : String.Empty;
                cvm.IsPublished = cat.IsPublished;
                cvm.DisplayOrder = cat.DisplayOrder;
                cvm.Description = cat.Description;
                cvm.ShowInHomepage = cat.ShowInHomepage;
                cvm.ImageName = cat.ImageName;
                
                list.Add(cvm);
            }

            return Json(list);
        }

        public JsonResult CreateCategory([FromBody] Category cat)
        {
            bool isSuccess = true;
            try
            {
                this.categoryService.CreateCategory(cat);

                // Remove category cache
                ObjectCache cache = MemoryCache.Default;
                cache.Remove(ConstKey.ckCategories);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }

        public JsonResult UpdateCategory([FromBody] Category cat)
        {
            bool isSuccess = true;
            try
            {
                this.categoryService.UpdateCategory(cat);

                // Remove category cache
                ObjectCache cache = MemoryCache.Default;
                cache.Remove(ConstKey.ckCategories);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }

        public JsonResult DeleteCategory([FromBody] Category cat)
        {
            bool isSuccess = true;
            try
            {
                this.categoryService.DeleteCategory(cat);

                // Remove category cache
                ObjectCache cache = MemoryCache.Default;
                cache.Remove(ConstKey.ckCategories);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }               
    }
}