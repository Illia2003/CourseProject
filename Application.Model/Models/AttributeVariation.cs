﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Application.Model.Models
{
    public partial class AttributeVariation
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string ProductId { get; set; }
        public decimal? Price { get; set; }
        public decimal? Discount { get; set; }
        public int? Quantity { get; set; }

        public virtual Product Product { get; set; }
    }
}