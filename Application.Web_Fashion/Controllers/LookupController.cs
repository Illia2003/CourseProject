using Application.Common;
using Application.Model.Models;
using Application.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Application.Controllers
{
    public class LookupController : Controller
    {
        private ILookupService lookupService;

        public LookupController(ILookupService lookupService)
        {
            this.lookupService = lookupService;            
        }

        public ActionResult Lookup()     
        {           
            return View();
        }

        public JsonResult GetLookups(string name)
        {
            var itemList = this.lookupService.GetLookupList(name);

            List<Lookup> list = new List<Lookup>();
            foreach (var item in itemList)
            {
                list.Add(new Lookup { Id = item.Id, Name = item.Name, Value = item.Value});
            }

            return Json(list);
        }
        public JsonResult CreateLookup([FromBody] Lookup lookup)
        {
            bool isSuccess = true;
            try
            {
                this.lookupService.CreateLookup(lookup);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult UpdateLookup([FromBody] Lookup lookup)
        {
            bool isSuccess = true;
            try
            {
                this.lookupService.UpdateLookup(lookup);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult DeleteLookup([FromBody] Lookup lookup)
        {
            bool isSuccess = true;
            try
            {
                this.lookupService.DeleteLookup(lookup);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }                            
    }
}