﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Application.Model.Models
{
    public partial class Product
    {
        public Product()
        {
            AttributeVariations = new HashSet<AttributeVariation>();
            OrderItems = new HashSet<OrderItem>();
            ProductImages = new HashSet<ProductImage>();
            ProductStocks = new HashSet<ProductStock>();
            Purchases = new HashSet<Purchase>();
        }

        public string Id { get; set; }
        public string UserId { get; set; }
        public int CategoryId { get; set; }
        public int BranchId { get; set; }
        public int? SupplierId { get; set; }
        public int? ItemTypeId { get; set; }        
        public string Barcode { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool? IsFeatured { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal? RetailPrice { get; set; }
        public int Quantity { get; set; }
        public decimal? Weight { get; set; }
        public string Unit { get; set; }
        public bool? IsDiscount { get; set; }
        public string DiscountType { get; set; }
        public int LowStockAlert { get; set; }
        public int? ViewCount { get; set; }
        public int? SoldCount { get; set; }
        public bool IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public string Status { get; set; }
        public DateTime ActionDate { get; set; }
        public decimal? Discount { get; set; }
        public virtual Branch Branch { get; set; }
        public virtual Category Category { get; set; }
        public virtual ItemType ItemType { get; set; }
        public virtual Supplier Supplier { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<AttributeVariation> AttributeVariations { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
        public virtual ICollection<ProductImage> ProductImages { get; set; }
        public virtual ICollection<ProductStock> ProductStocks { get; set; }
        public virtual ICollection<Purchase> Purchases { get; set; }
    }
}