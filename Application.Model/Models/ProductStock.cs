﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Application.Model.Models
{
    public partial class ProductStock
    {
        public string Id { get; set; }
        public string ProductId { get; set; }
        public int StockLocationId { get; set; }
        public int? Quantity { get; set; }
        public decimal? Weight { get; set; }
        public string Unit { get; set; }

        public virtual Product Product { get; set; }
        public virtual StockLocation StockLocation { get; set; }
    }
}