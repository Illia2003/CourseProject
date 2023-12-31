﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Application.Model.Models
{
    public partial class Branch
    {
        public Branch()
        {
            Orders = new HashSet<Order>();
            Products = new HashSet<Product>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsAllowOnline { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<UserBranch> UserBranches { get; set; } = new List<UserBranch>();
    }
}