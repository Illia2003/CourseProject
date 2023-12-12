using Application.Common;
using Application.Model.Models;
using Application.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Application.Controllers
{
    public class SupplierController : Controller
    {
        private ISupplierService supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            this.supplierService = supplierService;            
        }

        public ActionResult Supplier()     
        {           
            return View();
        }

        public JsonResult GetSupplierList()
        {
            var itemList = this.supplierService.GetSupplierList();

            List<Supplier> list = new List<Supplier>();
            foreach (var item in itemList)
            {
                list.Add(new Supplier { Id = item.Id, Name = item.Name });
            }

            return Json(list);
        }
        public JsonResult CreateSupplier([FromBody] Supplier supplier)
        {
            bool isSuccess = true;
            try
            {
                this.supplierService.CreateSupplier(supplier);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult UpdateSupplier([FromBody] Supplier supplier)
        {
            bool isSuccess = true;
            try
            {
                this.supplierService.UpdateSupplier(supplier);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult DeleteSupplier([FromBody] Supplier supplier)
        {
            bool isSuccess = true;
            try
            {
                this.supplierService.DeleteSupplier(supplier);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
    }
}