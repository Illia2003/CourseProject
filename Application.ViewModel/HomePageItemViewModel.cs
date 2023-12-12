using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Application.ViewModel
{
    public class HomePageItem
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string TitleSEO { get; set; }
        public decimal? RetailPrice { get; set; }
        public decimal? Discount { get; set; }        
        public decimal? AuctionStartPrice { get; set; }               
        public bool? IsPriceNegotiable { get; set; }
        public bool IsAuction { get; set; }
        public string PriceText { get; set; }
        public string PriceTextOld { get; set; }
        public string LocationName { get; set; }
        public string PrimaryImageName { get; set; }
    }
}