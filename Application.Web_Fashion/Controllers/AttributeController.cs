using Application.Common;
using Application.Model.Models;
using Application.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Application.Controllers
{
    public class AttributeController : Controller
    {
        private IAttributeNameService attributeNameService;

        public AttributeController(IAttributeNameService attributeNameService)
        {
            this.attributeNameService = attributeNameService;            
        }

        public ActionResult AttributeName()     
        {           
            return View();
        }

        public JsonResult GetAttributeNameList()
        {
            var list = this.attributeNameService.GetAttributeNames();
            return Json(list);
        }
        public JsonResult CreateAttributeName([FromBody] AttributeName item)
        {
            bool isSuccess = true;
            try
            {
                item.Id = Guid.NewGuid().ToString();
                this.attributeNameService.CreateAttributeName(item);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult UpdateAttributeName([FromBody] AttributeName item)
        {
            bool isSuccess = true;
            try
            {
                this.attributeNameService.UpdateAttributeName(item);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult DeleteAttributeName([FromBody] AttributeName item)
        {
            bool isSuccess = true;
            try
            {
                this.attributeNameService.DeleteAttributeName(item);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }        
                    
    }
}