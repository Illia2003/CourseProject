using Application.Common;
using Application.Model.Models;
using Application.Service;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    public class ItemTypeController : Controller
    {
        private IItemTypeService itemTypeService;

        public ItemTypeController(IItemTypeService itemTypeService)
        {
            this.itemTypeService = itemTypeService;            
        }

        public ActionResult ItemType()     
        {           
            return View();
        }

        public JsonResult GetItemTypeList()
        {
            var itemList = this.itemTypeService.GetItemTypeList();

            List<ItemType> list = new List<ItemType>();
            foreach (var item in itemList)
            {
                list.Add(new ItemType { Id = item.Id, Name = item.Name });
            }

            return Json(list);
        }
        public JsonResult CreateItemType([FromBody] ItemType itemType)
        {
            bool isSuccess = true;
            try
            {
                this.itemTypeService.CreateItemType(itemType);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult UpdateItemType([FromBody] ItemType itemType)
        {
            bool isSuccess = true;
            try
            {
                this.itemTypeService.UpdateItemType(itemType);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult DeleteItemType([FromBody] ItemType itemType)
        {
            bool isSuccess = true;
            try
            {
                this.itemTypeService.DeleteItemType(itemType);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }                            
    }
}