
namespace Application.ViewModel
{
    public class TotalRecordsViewModel
    {
        public int TotalRecords { get; set; }
    }

    public class OrderStatusViewModel
    {
        public int StoreSell { get; set; }
        public int OnlineSell { get; set; }
        public int PhoneOrderSell { get; set; }
        public int OrderPending { get; set; }
    }

    public class TotalItemValues
    {
        public int TotalItemPosted { get; set; }
        public decimal TotalItemValue { get; set; }
    }

    public class CategoryTree
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int Level { get; set; }
        public string Name { get; set; }

    }
    
    public class HomePageCategoryItemSetting
    {
        public int Id { get; set; }
        public string Title { get; set; }
    }

    public class PriceRange
    {
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
    }

    public class ChildIds
    {
        public int Id { get; set; }
    }

    public class ProductCode
    {
        public decimal Code { get; set; }
    }

    public class SaleSummary
    {
        public int TotalOrder { get; set; }
        public decimal TotalVat { get; set; }
        public decimal TotalShippingAmount { get; set; }
        public decimal TotalSellsAmount { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalCostAmount { get; set; }
        public decimal TotalProfit { get; set; }
    }

    public class SaleProfitLoss
    {
        public decimal TotalCostPrice { get; set; }
        public decimal TotalSellPrice { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalVat { get; set; }
        public decimal TotalShippingAmount { get; set; }
    }

    public class MonthlySales
    {
        public string Month { get; set; }
        public decimal TotalStoreSell { get; set; }
        public decimal TotalOnlineSell { get; set; }
        public decimal TotalPhoneOrderSell { get; set; }
        public decimal TotalSell { get; set; }
    }

    public class DailySales
    {
        public string Day { get; set; }
        public decimal TotalSell { get; set; }
    }

    public class ChildIdsViewModel
    {
        public int Id { get; set; }
    }
}