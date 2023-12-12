using System.Collections.Generic;
using System.Linq;
using Application.Data.Repository;
using Application.Data.Infrastructure;
using Application.Model.Models;
using Application.Service.Properties;
using System;
using Application.Common;
using Application.ViewModel;
using Application.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Application.Service
{

    public interface IProductService
    {
        void CreateProduct(Product product);
        IEnumerable<Product> GetProducts();
        IEnumerable<Product> GetUnApprovedProducts();
        IEnumerable<Product> GetHomePageProducts(int count);
        IEnumerable<Product> GetRelatedProducts(int numberOfProducts, int categoryId);
        IEnumerable<ProductViewModel> GetProductsByCategory(int numberOfProducts, string categoryIds);
        IEnumerable<ProductViewModel> GetMyProducts(string userId, int branchId = 0, string categoryIds = "", int itemTypeId = 0, int supplierId = 0, string attribute = "", string lowStock = "");
        IEnumerable<Product> GetAllProducts(int branchId);        
        IEnumerable<Product> GetStoreNewProducts(string userId, int count);        
        Product GetProduct(string id);
        Product GetProductByBarcode(string barcode);
        bool IsBarcodeExists(string barcode, string excludeProductId = "");
        bool IsBarcodeExists(int branchId, string barcode, string excludeProductId = "");
        bool ApproveProduct(string productId, bool isApprove);
        bool DeleteProduct(string productId);
        bool UpdateProduct(Product product);        
        void UpdateViewCount(string productId);
        void UpdateSoldCount(string productId);
        void UpdateStockQty(string productId, int quantity);
        void MinusStockQty(string productId, int soldQuantity);
        void AddStockQty(string productId, int soldQuantity);
        decimal GetCostPrice(string productId);
        int GetLowStockItemCount();
        List<HomePageItem> GetFeaturedItems();
        List<HomePageItem> GetPopularItems();
        List<HomePageItem> GetNewArrivalsItems();
        List<HomePageItem> GetCategoryItems(string catIds);

        void Commit();
    }

    public class ProductService : IProductService
    {
        private readonly IProductRepository productRepository;
        private readonly IUnitOfWork unitOfWork;

        public ProductService(IProductRepository productRepository, IUnitOfWork unitOfWork)
        {
            this.productRepository = productRepository;
            this.unitOfWork = unitOfWork;           
        }
        
        #region IProductService Members

        public void CreateProduct(Product product)
        {
            productRepository.Add(product);
            Commit();
        }

        public IEnumerable<Product> GetProducts()
        {
            var products = productRepository.GetMany(r=> r.IsApproved == true && r.IsDeleted == false).OrderByDescending(r => r.ActionDate).ToList();
            return products;
        }

        public IEnumerable<Product> GetUnApprovedProducts()
        {
            var products = productRepository.GetMany(r => r.IsApproved == false && r.IsDeleted == false).OrderByDescending(r => r.ActionDate).ToList();
            return products;
        }

        public IEnumerable<Product> GetHomePageProducts(int count)
        {
            var products = productRepository.GetMany(r => r.ProductImages.Count() > 0 &&  r.IsApproved == true && r.IsDeleted == false).OrderBy(r => Guid.NewGuid()).ToList().Take(count);
            return products;
        }

        public IEnumerable<Product> GetRelatedProducts(int numberOfProducts, int categoryId)
        {
            var products = productRepository.GetMany(r=> r.CategoryId == categoryId && r.IsApproved == true && r.IsDeleted == false).OrderByDescending(r => r.ActionDate).Take(numberOfProducts).ToList();
            return products;
        }

        public IEnumerable<ProductViewModel> GetProductsByCategory(int numberOfProducts, string categoryIds)
        {
            List<ProductViewModel> list = new List<ProductViewModel>();

            string sql = String.Format("Select top {0} * From Products p Where p.IsDeleted = 0 And CategoryId In ({1}) order by ViewCount desc", numberOfProducts, categoryIds);

            list = Utils.ExecuteQuery<ProductViewModel>(sql).ToList();            

            return list;
        }

        public IEnumerable<ProductViewModel> GetMyProducts(string userId, int branchId = 0, string categoryIds = "", int itemTypeId = 0, int supplierId = 0, string attribute = "", string lowStock = "")
        {
            List<ProductViewModel> list = new List<ProductViewModel>();

            string sql = "select p.* from Products p where p.IsDeleted = 0";
            
            if (branchId > 0)
            {
                sql += String.Format(" and BranchId = {0} ", branchId);
            }

            if (!String.IsNullOrEmpty(categoryIds))
            {
                sql += " and CategoryId IN (" + categoryIds + ")";
            }

            if (itemTypeId > 0)
            {
                sql += String.Format(" and ItemTypeId = {0} ", itemTypeId);
            }

            if (supplierId > 0)
            {
                sql += String.Format(" and SupplierId = {0} ", supplierId);
            }

            if (!String.IsNullOrEmpty(attribute))
            {
                if (attribute == "Main")
                {
                    sql += " and IsMainItem = 1 ";
                }
                else if (attribute == "FastMoving")
                {
                    sql += " and IsFastMoving = 1 ";
                }
                else if (attribute == "Internal")
                {
                    sql += " and IsInternal = 1 ";
                }
            }

            if (!String.IsNullOrEmpty(lowStock))
            {
                sql += String.Format(" and Quantity <= LowStockAlert ");
            }

            // Exclude anonymous product
            sql += String.Format(" and Id != '00000000-0000-0000-0000-000000000000' ");
            
            // Order by clause
            sql += " order by ActionDate desc ";

            list = Utils.ExecuteQuery<ProductViewModel>(sql).ToList();

            return list;
        }

        public decimal GetCostPrice(string productId)
        {
            decimal costPrice = 0;
            string sql = String.Format("select ISNULL(CostPrice,0) as Value from Products where Id = '{0}'", productId);
                        
            var item = Utils.ExecuteQuery<DecimalItem>(sql).FirstOrDefault();
            if(item != null)
            {
                costPrice = item.Value;
            }

            return costPrice;
        }

        public int GetLowStockItemCount()
        {
            int lowStockCount = 0;
            string sql = String.Format("select count(*) as LowStockCount from products where Quantity <= LowStockAlert and IsDeleted = 0 and Id != '00000000-0000-0000-0000-000000000000'");

            var item = Utils.ExecuteQuery<IntItem>(sql).FirstOrDefault();
            if (item != null)
            {
                lowStockCount = item.Value;
            }

            return lowStockCount;
        }        

        public IEnumerable<Product> GetStoreNewProducts(string userId, int count)
        {
            var products = productRepository.GetMany(r =>r.IsApproved == true && r.IsDeleted == false && r.UserId == userId).OrderByDescending(r => r.ActionDate).Take(count).ToList();
            return products;
        }

        public Product GetProduct(string id)
        {
            var product = productRepository.Get(r => r.Id == id);

            return product;
        }

        public Product GetProductByBarcode(string barcode)
        {
            var product = productRepository.Get(r => r.Barcode == barcode);

            return product;
        }

        public IEnumerable<Product> GetAllProducts(int branchId)
        {
            var products = productRepository.GetMany(r => r.BranchId == branchId && r.IsDeleted == false);
            return products;
        }        

        public bool IsBarcodeExists(string barcode, string excludeProductId = "")
        {
            Product product;

            if (!String.IsNullOrEmpty(excludeProductId))
            {
                product = productRepository.Get(r => r.Barcode == barcode && r.Id != excludeProductId);
            }
            else
            {
                product = productRepository.Get(r => r.Barcode == barcode);
            }

            bool isExists = product != null ? true : false;
            return isExists;
        }

        public bool IsBarcodeExists(int branchId, string barcode, string excludeProductId = "")
        {
            Product product;

            if (!String.IsNullOrEmpty(excludeProductId))
            {
                product = productRepository.Get(r => r.BranchId == branchId && r.Barcode == barcode && r.Id != excludeProductId);
            }
            else
            {
                product = productRepository.Get(r => r.BranchId == branchId && r.Barcode == barcode);
            }

            bool isExists = product != null ? true : false;
            return isExists;
        } 

        public bool ApproveProduct(string productId, bool isApprove)
        {
            var product = productRepository.Get(r => r.Id == productId);
            if (product != null)
            {
                product.IsApproved = isApprove;
                productRepository.Update(product);
                Commit();
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool DeleteProduct(string productId)
        {
            var product = productRepository.Get(r => r.Id == productId);
            if (product != null)
            {
                product.IsDeleted = true;
                product.Barcode = product.Barcode + "_deleted_" + DateTime.Now.Ticks.ToString();                
                productRepository.Update(product);
                Commit();
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool UpdateProduct(Product product)
        {
            if (product != null)
            {
                productRepository.Update(product);
                Commit();
                return true;
            }
            else
            {
                return false;
            }
        }        

        public void UpdateViewCount(string productId)
        {
            string sql = String.Format("Update Products Set ViewCount = ISNULL(ViewCount, 0 ) + 1 where Id = '{0}'", productId);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }
        }

        public void UpdateSoldCount(string productId)
        {
            string sql = String.Format("Update Products Set SoldCount = ISNULL(SoldCount, 0 ) + 1 where Id = '{0}'", productId);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);                
            }
        }

        public void UpdateStockQty(string productId, int quantity)
        {
            string sql = String.Format("Update Products Set Quantity = {1} where Id = '{0}'", productId, quantity);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }
        }

        public void MinusStockQty(string productId, int soldQuantity)
        {
            string sql = String.Format("Update Products Set Quantity = ISNULL(Quantity, 0 ) - {1} where Id = '{0}'", productId, soldQuantity);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }
        }

        public void AddStockQty(string productId, int soldQuantity)
        {
            string sql = String.Format("Update Products Set Quantity = ISNULL(Quantity, 0 ) + {1} where Id = '{0}'", productId, soldQuantity);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }
        }

        public List<HomePageItem> GetFeaturedItems()
        {
            List<HomePageItem> list = new List<HomePageItem>();

            string sql = @"select top 24 p.Id as Id, p.Title as Title, p.RetailPrice, p.Discount, pi.ImageName as PrimaryImageName
                            from Products p, ProductImages pi
                            where p.Id = pi.ProductId and pi.IsPrimaryImage = 1 and pi.IsApproved = 1 and p.IsApproved = 1 and p.IsDeleted = 0and p.IsFeatured = 1";

            list = Utils.ExecuteQuery<HomePageItem>(sql).ToList();

            return list;
        }

        public List<HomePageItem> GetPopularItems()
        {
            List<HomePageItem> list = new List<HomePageItem>();

            string sql = @"select top 10 p.Id as Id, p.Title as Title, p.RetailPrice, p.Discount, pi.ImageName as PrimaryImageName
                            from Products p, ProductImages pi
                            where p.Id = pi.ProductId and pi.IsPrimaryImage = 1 and pi.IsApproved = 1 and p.IsApproved = 1 and p.IsDeleted = 0
                            order by SoldCount desc";

            list = Utils.ExecuteQuery<HomePageItem>(sql).ToList();

            return list;
        }

        public List<HomePageItem> GetNewArrivalsItems()
        {
            List<HomePageItem> list = new List<HomePageItem>();

            string sql = @"select top 10 p.Id as Id, p.Title as Title, p.RetailPrice, p.Discount, pi.ImageName as PrimaryImageName
                            from Products p, ProductImages pi
                            where p.Id = pi.ProductId and pi.IsPrimaryImage = 1 and pi.IsApproved = 1 and p.IsApproved = 1 and p.IsDeleted = 0
                            order by p.ActionDate desc";

            list = Utils.ExecuteQuery<HomePageItem>(sql).ToList();

            return list;
        }

        public List<HomePageItem> GetCategoryItems(string catIds)
        {
            List<HomePageItem> list = new List<HomePageItem>();

            string sql = String.Format(@"select top 10 p.Id as Id, p.Title as Title, p.RetailPrice, p.Discount, pi.ImageName as PrimaryImageName
                            from Products p, ProductImages pi, Category c
                            where p.Id = pi.ProductId and p.CategoryId = c.Id and pi.IsPrimaryImage = 1 and p.IsDeleted = 0
                            and c.Id in ({0})
                            order by ViewCount desc", catIds);

            list = Utils.ExecuteQuery<HomePageItem>(sql).ToList();

            return list;
        }

        public void Commit()
        {
            unitOfWork.Commit();
        }

        #endregion
    }

    public class DecimalItem
    {
        public decimal Value { get; set; }
    }

    public class IntItem
    {
        public int Value { get; set; }
    }
}
