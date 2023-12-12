using Application.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Application.ViewModel
{
    public class ProductViewModel
    {
        public string Id { get; set; }
        public int Code { get; set; }    
        public string Title { get; set; }
        public string Barcode { get; set; }                
        public string RootCategoryName { get; set; }
        public int BranchId { get; set; }
        public Nullable<int> SupplierId { get; set; }
        public Nullable<int> ItemTypeId { get; set; }
        public string SupplierName { get; set; }
        public string ItemTypeName { get; set; }
        public string TitleSEO { get; set; }
        public string Description { get; set; }
        public string PrimaryImageName { get; set; }
        public bool IsApproved { get; set; }
        public bool IsFavorite { get; set; }
        public DateTime ActionDate { get; set; }
        public string ActionDateString { get; set; }
        public string PostingTime { get; set; }
        public int Quantity { get; set; }
        public Nullable<decimal> CostPrice { get; set; }
        public Nullable<decimal> RetailPrice { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public string CostPriceText { get; set; }
        public string PriceText { get; set; }
        public string PriceTextOld { get; set; }
        public string DiscountText { get; set; }
        public string Status { get; set; }
        public Nullable<bool> IsFeatured { get; set; }
        public decimal? Weight { get; set; }
        public int LowStockAlert { get; set; }
        public string Unit { get; set; }
        public string WeightText { get; set; }
        public string Attributes { get; set; }
        public string DefaultSize { get; set; }
        public string DefaultColor { get; set; }
        public List<BreadCrumbViewModel> BreadCrumbList { get; set; }
        public List<ProductImageViewModel> ImageList { get; set; }        
        public UserViewModel Seller { get; set; }
        public CategoryViewModel Category { get; set; }
        public List<AttributeVariation> AttributeVariations { get; set; }
    }
}