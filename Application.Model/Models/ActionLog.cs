﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Application.Model.Models
{
    public partial class ActionLog
    {
        public string Id { get; set; }
        public string Module { get; set; }
        public string Description { get; set; }
        public string Value { get; set; }
        public string ActionType { get; set; }
        public string ActionBy { get; set; }
        public DateTime? ActionDate { get; set; }
    }
}