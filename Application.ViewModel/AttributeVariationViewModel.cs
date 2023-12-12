using Application.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Application.ViewModel
{
    public class AttributeVariationViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string ProductId { get; set; }
        public Nullable<decimal> Price { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public Nullable<int> Quantity { get; set; }
    }
}